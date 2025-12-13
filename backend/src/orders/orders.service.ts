import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository, Between, ILike } from 'typeorm';
import { ProductVariant } from 'src/products/entities/product-variant.entity';
import { User } from 'src/users/entities/user.entity';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { FindOrdersQueryDto } from './dto/find-orders-query.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(ProductVariant)
    private readonly variantRepository: Repository<ProductVariant>,
    private readonly dataSource: DataSource,
  ) {}

  private async generateOrderId(): Promise<string> {
    const lastOrder = await this.orderRepository.findOne({
      where: {},
      order: { createdAt: 'DESC' },
    });
    const lastId =
      lastOrder && lastOrder.orderId
        ? parseInt(lastOrder.orderId.split('-')[1])
        : 0;
    return `TG-${(lastId + 1).toString().padStart(4, '0')}`;
  }

  async create(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
    const { items, shippingAddress, deliveryCharge } = createOrderDto;
    const variantIds = items.map((item) => item.variantId);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const variants = await queryRunner.manager.findBy(ProductVariant, {
        id: In(variantIds),
      });
      let subTotal = 0;
      const orderItems: OrderItem[] = [];
      for (const itemDto of items) {
        const variant = variants.find((v) => v.id === itemDto.variantId);
        if (!variant)
          throw new NotFoundException(
            `Product variant with ID ${itemDto.variantId} not found.`,
          );
        if (variant.stock < itemDto.quantity)
          throw new BadRequestException(
            `Not enough stock for ${variant.title}. Available: ${variant.stock}`,
          );
        variant.stock -= itemDto.quantity;
        await queryRunner.manager.save(variant);
        subTotal += variant.price * itemDto.quantity;
        const orderItem = new OrderItem();
        orderItem.variant = variant;
        orderItem.quantity = itemDto.quantity;
        orderItem.titleAtPurchase = variant.title;
        orderItem.priceAtPurchase = variant.price;
        orderItems.push(orderItem);
      }
      const newOrder = this.orderRepository.create({
        orderId: await this.generateOrderId(),
        user,
        shippingAddress,
        items: orderItems,
        subTotal,
        deliveryCharge,
        totalAmount: subTotal + deliveryCharge,
        status: OrderStatus.PROCESSING,
      });
      const savedOrder = await queryRunner.manager.save(newOrder);
      await queryRunner.commitTransaction();
      return savedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllAdmin(queryDto?: FindOrdersQueryDto): Promise<Order[]> {
    const where: any = {};
    if (queryDto?.status) where.status = queryDto.status;
    if (queryDto?.date) {
      const startDate = new Date(queryDto.date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(queryDto.date);
      endDate.setHours(23, 59, 59, 999);
      where.createdAt = Between(startDate, endDate);
    }
    return this.orderRepository.find({
      where,
      relations: ['user', 'items', 'items.variant'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOneAdmin(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'items', 'items.variant'],
    });
    if (!order)
      throw new NotFoundException(`Order with ID "${id}" not found.`);
    return order;
  }

  async updateStatus(updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order> {
    const { orderId, status } = updateOrderStatusDto;
    const order = await this.orderRepository.findOne({ where: { orderId } });
    if (!order)
      throw new NotFoundException(`Order with ID "${orderId}" not found.`);
    order.status = status;
    return this.orderRepository.save(order);
  }

  async findAllForUser(user: User, searchTerm?: string): Promise<Order[]> {
    const queryBuilder = this.orderRepository.createQueryBuilder('order');

    queryBuilder
      .leftJoinAndSelect('order.items', 'item')
      .leftJoinAndSelect('item.variant', 'variant') // Eager load variant details
      .leftJoin('order.user', 'user') // Join user to filter by ID
      .where('user.id = :userId', { userId: user.id });

    if (searchTerm) {
      queryBuilder.andWhere(
        '(order.orderId ILIKE :searchTerm OR item.titleAtPurchase ILIKE :searchTerm)',
        { searchTerm: `%${searchTerm}%` }
      );
    }
    
    queryBuilder.orderBy('order.createdAt', 'DESC');

    return queryBuilder.getMany();
  }

  async findOneForUser(id: string, user: User): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id, user: { id: user.id } },
      relations: ['items', 'items.variant'],
    });
    if (!order)
      throw new NotFoundException(`Order with ID "${id}" not found.`);
    return order;
  }
}

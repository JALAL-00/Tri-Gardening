import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository, Between } from 'typeorm';
import { ProductVariant } from 'src/products/entities/product-variant.entity';
import { User } from 'src/users/entities/user.entity';
import { Referral } from 'src/users/entities/referral.entity'; 
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { FindOrdersQueryDto } from './dto/find-orders-query.dto';
import { CreateAdminOrderDto } from './dto/create-admin-order.dto'; 

@Injectable()
export class OrdersService {

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(ProductVariant)
    private readonly variantRepository: Repository<ProductVariant>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Referral)
    private readonly referralRepository: Repository<Referral>,
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

  // --- ADMIN: CREATE ORDER ---
  async createByAdmin(dto: CreateAdminOrderDto): Promise<Order> {
    const { userId, items } = dto;

    const user = await this.userRepository.findOne({ 
      where: { id: userId },
      relations: ['addresses'] 
    });
    if (!user) throw new NotFoundException('User not found');

    const address = user.addresses.find(a => a.isDefault) || user.addresses[0];
    if (!address) {
      throw new BadRequestException('User has no saved addresses. Cannot create order.');
    }

    const shippingAddress = {
      fullName: user.fullName,
      phone: user.phone,
      thana: address.thana,
      district: address.district,
      fullAddress: address.fullAddress,
    };

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
        if (!variant) throw new NotFoundException(`Product variant ${itemDto.variantId} not found.`);
        if (variant.stock < itemDto.quantity) throw new BadRequestException(`Not enough stock for ${variant.title}`);

        variant.stock -= itemDto.quantity;
        await queryRunner.manager.save(variant);

        subTotal += Number(variant.price) * itemDto.quantity;

        const orderItem = new OrderItem();
        orderItem.variant = variant;
        orderItem.quantity = itemDto.quantity;
        orderItem.titleAtPurchase = variant.title;
        orderItem.priceAtPurchase = variant.price;
        orderItems.push(orderItem);
      }

      const deliveryCharge = 100; 
      const totalAmount = subTotal + deliveryCharge;

      const newOrder = this.orderRepository.create({
        orderId: await this.generateOrderId(),
        user,
        shippingAddress,
        items: orderItems,
        subTotal,
        deliveryCharge,
        totalAmount,
        walletDiscount: 0, 
        payableAmount: totalAmount,
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

  // --- CUSTOMER: CREATE ORDER (Wallet Logic Implemented) ---
  async create(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
    const { items, shippingAddress, deliveryCharge, useWallet } = createOrderDto;

    const currentUser = await this.userRepository.findOne({ where: { id: user.id } });
    if (!currentUser) throw new NotFoundException('User not found');

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
        
        // Stock Deduction
        variant.stock -= itemDto.quantity;
        await queryRunner.manager.save(variant);

        subTotal += Number(variant.price) * itemDto.quantity;
        
        const orderItem = new OrderItem();
        orderItem.variant = variant;
        orderItem.quantity = itemDto.quantity;
        orderItem.titleAtPurchase = variant.title;
        orderItem.priceAtPurchase = variant.price;
        orderItems.push(orderItem);
      }

      const totalAmount = subTotal + deliveryCharge;
      let walletDiscount = 0;
      let payableAmount = totalAmount;

      // Wallet Deduction Logic
      if (useWallet && currentUser.walletBalance > 0) {
        const currentBalance = Number(currentUser.walletBalance);
        
        if (currentBalance >= totalAmount) {
           walletDiscount = totalAmount;
           currentUser.walletBalance = currentBalance - totalAmount;
        } else {
           walletDiscount = currentBalance;
           currentUser.walletBalance = 0;
        }
        payableAmount = totalAmount - walletDiscount;
        await queryRunner.manager.save(currentUser); 
      }

      const newOrder = this.orderRepository.create({
        orderId: await this.generateOrderId(),
        user,
        shippingAddress,
        items: orderItems,
        subTotal,
        deliveryCharge,
        totalAmount,
        walletDiscount,
        payableAmount,
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

  // --- UPDATE STATUS (Referral Reward Logic Implemented) ---
  async updateStatus(updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order> {
    const { orderId, status } = updateOrderStatusDto;
    const order = await this.orderRepository.findOne({ 
      where: { orderId },
      relations: ['user'] 
    });
    if (!order)
      throw new NotFoundException(`Order with ID "${orderId}" not found.`);

    if (order.status !== OrderStatus.DELIVERED && status === OrderStatus.DELIVERED) {
       const referral = await this.referralRepository.findOne({ 
          where: { referredUser: { id: order.user.id }, status: 'pending' },
          relations: ['referrer']
       });

       if (referral) {
         const commission = 150; 
         
         referral.status = 'successful';
         referral.commissionEarned = commission;
         await this.referralRepository.save(referral);

         const referrer = await this.userRepository.findOne({ where: { id: referral.referrer.id } });
         if (referrer) {
            referrer.walletBalance = Number(referrer.walletBalance) + commission;
            await this.userRepository.save(referrer);
            console.log(`Commission of ${commission} added to ${referrer.fullName}`);
         }
       }
    }

    order.status = status;
    return this.orderRepository.save(order);
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

  async remove(id: string): Promise<void> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" not found.`);
    }
    await this.orderRepository.remove(order);
  }
  
}

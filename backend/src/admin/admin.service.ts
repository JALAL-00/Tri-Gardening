import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan } from 'typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { ProductVariant } from 'src/products/entities/product-variant.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(ProductVariant) private variantRepo: Repository<ProductVariant>,
  ) {}

  async getDashboardStats() {
    // 1. Total Revenue
    const { totalRevenue } = await this.orderRepo
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'totalRevenue')
      .getRawOne();

    // 2. Today's Sales count
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaysSales = await this.orderRepo.count({
      where: { createdAt: Between(today, new Date()) },
    });

    // 3. Total Customers
    const totalCustomers = await this.userRepo.count({ where: { role: 'customer' as any } });

    // 4. Products Sold (Sum of order items quantities) - Simplified for performance
    const { productsSold } = await this.orderRepo
      .createQueryBuilder('order')
      .leftJoin('order.items', 'items')
      .select('SUM(items.quantity)', 'productsSold')
      .getRawOne();

    // 5. Low Stock Alerts
    const lowStockVariants = await this.variantRepo
      .createQueryBuilder('variant')
      .where('variant.stock <= variant.stockAlertLimit')
      .leftJoinAndSelect('variant.product', 'product')
      .getMany();

    // 6. Sales Graph Data (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const salesData = await this.orderRepo
      .createQueryBuilder('order')
      .select("TO_CHAR(order.createdAt, 'Dy')", 'day')
      .addSelect('SUM(order.totalAmount)', 'revenue')
      .where('order.createdAt >= :date', { date: sevenDaysAgo })
      .groupBy("TO_CHAR(order.createdAt, 'Dy')")
      .orderBy("MIN(order.createdAt)", "ASC")
      .getRawMany();

    return {
      totalRevenue: parseFloat(totalRevenue) || 0,
      todaysSales,
      totalCustomers,
      productsSold: parseInt(productsSold) || 0,
      lowStockAlerts: lowStockVariants.map(v => ({
         id: v.id, 
         name: v.product.name, 
         variant: v.title, 
         stock: v.stock,
         limit: v.stockAlertLimit 
      })),
      salesGraph: salesData,
    };
  }

  async getAllUsers() {
    return this.userRepo.find({ order: { createdAt: 'DESC' } });
  }

  async updateUserRole(id: string, role: any) {
    await this.userRepo.update(id, { role });
    return this.userRepo.findOneBy({ id });
  }
}
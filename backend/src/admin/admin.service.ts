import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
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

    // 4. Products Sold
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
      .addGroupBy("DATE(order.createdAt)") 
      .orderBy("DATE(order.createdAt)", "ASC")
      .getRawMany();

    // 7. Recent Orders (Real Data)
    const recentOrders = await this.orderRepo.find({
      take: 5,
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });

    // 8. Top Selling Products (Real Data)
    const topSelling = await this.orderRepo.manager.query(`
      SELECT p.name, SUM(oi.quantity) as sold, pv.images
      FROM order_items oi
      JOIN product_variants pv ON oi."variantId" = pv.id
      JOIN products p ON pv."productId" = p.id
      GROUP BY p.id, p.name, pv.images
      ORDER BY sold DESC
      LIMIT 5
    `);

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
      recentOrders: recentOrders.map(o => ({
        id: o.orderId,
        customer: o.user.fullName, // Or shippingAddress.fullName
        amount: o.totalAmount,
        status: o.status
      })),
      topSelling: topSelling.map((p: any) => ({
        name: p.name,
        sold: p.sold,
        image: p.images ? p.images.split(',')[0] : null 
      }))
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
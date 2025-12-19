import { ProductVariant } from 'src/products/entities/product-variant.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  order: Order;
  
  @ManyToOne(() => ProductVariant, { eager: true, onDelete: 'SET NULL', nullable: true })
  variant: ProductVariant | null;

  @Column()
  quantity: number;

  @Column({ type: 'varchar' })
  titleAtPurchase: string; 

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  priceAtPurchase: number; 
}
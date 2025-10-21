import { User } from 'src/users/entities/user.entity';
import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany
} from 'typeorm';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // A custom, human-readable order ID
  @Column({ type: 'varchar', unique: true })
  orderId: string;
  
  @ManyToOne(() => User, { eager: true })
  user: User;
  
  @Column({ type: 'jsonb' })
  shippingAddress: {
    fullName: string;
    phone: string;
    thana: string;
    district: string;
    fullAddress: string;
  };
  
  @OneToMany(() => OrderItem, (item: OrderItem) => item.order, { cascade: true, eager: true })
  items: OrderItem[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subTotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  deliveryCharge: number;
  
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;
  
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PROCESSING })
  status: OrderStatus;
  
  @CreateDateColumn()
  createdAt: Date;
  
  @UpdateDateColumn()
  updatedAt: Date;
}
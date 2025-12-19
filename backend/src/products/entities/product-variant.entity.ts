import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  title: string; // e.g. "Small", "10kg Bag"

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number; // MRP / Selling Price

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  buyingPrice: number; // Cost Price

  @Column({ type: 'int' })
  stock: number;

  @Column({ type: 'int', default: 5 })
  stockAlertLimit: number;

  @Column({ type: 'timestamp', nullable: true })
  expiryDate: Date | null;

  @Column({ type: 'varchar', nullable: true })
  sku: string | null;

  @Column({ type: 'varchar', nullable: true })
  color: string | null; // Hex code or name

  @Column('simple-array', { nullable: true })
  images: string[];

  @ManyToOne(() => Product, (product) => product.variants, { onDelete: 'CASCADE' })
  product: Product;
}
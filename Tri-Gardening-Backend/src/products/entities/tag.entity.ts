import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
} from 'typeorm';
import { Product } from './product.entity';
import { Blog } from './blog.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  name: string;

  // --- RELATIONS ---

  // Many-to-many with products
  @ManyToMany(() => Product, (product) => product.tags)
  products: Product[];

  // Many-to-many with blogs
  @ManyToMany(() => Blog, (blog) => blog.tags)
  blogs: Blog[];
  
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  thana: string;

  @Column()
  district: string;

  @Column({ type: 'text' })
  fullAddress: string;

  @ManyToOne(() => User, (user) => user.addresses)
  user: User;
}
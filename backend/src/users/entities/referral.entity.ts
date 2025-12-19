import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Column } from 'typeorm';
import { User } from './user.entity';

@Entity('referrals')
export class Referral {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true }) // The person who referred
  referrer: User;

  @ManyToOne(() => User, { eager: true }) // The new user who signed up
  referredUser: User;

  @Column({ type: 'enum', enum: ['pending', 'successful'], default: 'pending' })
  status: 'pending' | 'successful';

  @Column({ type: 'decimal', default: 0 })
  commissionEarned: number;

  @CreateDateColumn()
  createdAt: Date;
}
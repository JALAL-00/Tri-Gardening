// src/users/entities/user.entity.ts
import { Address } from './address.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  fullName: string;

  @Column({ type: 'varchar', unique: true })
  phone: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  email: string | null;

  @Column({ type: 'varchar' })
  password: string;


  @Column({ type: 'varchar', nullable: true })
  passwordResetToken: string | null;

  @Column({ type: 'timestamp', nullable: true })
  passwordResetExpires: Date | null;


  @Column({ type: 'varchar', nullable: true })
  passwordResetOtp: string | null;

  @Column({ type: 'timestamp', nullable: true })
  otpExpires: Date | null;

  @Column({ type: 'varchar', nullable: true })
  profilePictureUrl: string | null;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @OneToMany(() => Address, (address) => address.user, {
    cascade: true,
    eager: true,
  })
  addresses: Address[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { ProductVariant } from 'src/products/entities/product-variant.entity';
import { User } from 'src/users/entities/user.entity';
import { Referral } from 'src/users/entities/referral.entity'; 
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order, 
      OrderItem, 
      ProductVariant, 
      User,     
      Referral  
    ]),
    AuthModule
  ],
  providers: [OrdersService],
  controllers: [OrdersController]
})
export class OrdersModule {}
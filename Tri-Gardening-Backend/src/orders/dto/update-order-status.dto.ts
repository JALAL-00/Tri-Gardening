import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';

export class UpdateOrderStatusDto {
  @IsString()
  @IsNotEmpty()
  orderId: string; // The human-readable ID, e.g., "TG-0001"

  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;
}
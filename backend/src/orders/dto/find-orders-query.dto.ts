import { IsEnum, IsOptional, IsDateString } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';

export class FindOrdersQueryDto {
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @IsDateString()
  @IsOptional()
  date?: string; // e.g., '2023-10-27'
}
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsUUID, ValidateNested, Min } from 'class-validator';

export class AdminOrderItemDto {
  @IsUUID()
  @IsNotEmpty()
  variantId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateAdminOrderDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdminOrderItemDto)
  items: AdminOrderItemDto[];
}
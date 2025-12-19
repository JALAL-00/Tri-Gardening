import { Type } from 'class-transformer';
import {
  IsArray, IsNotEmpty, IsNumber, IsString, IsUUID, ValidateNested, Min, IsPhoneNumber, IsBoolean, IsOptional
} from 'class-validator';

class OrderItemDto {
  @IsUUID()
  @IsNotEmpty()
  variantId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

class ShippingAddressDto {
  @IsString() @IsNotEmpty()
  fullName: string;
  
  @IsPhoneNumber('BD') @IsNotEmpty()
  phone: string;
  
  @IsString() @IsNotEmpty()
  thana: string;
  
  @IsString() @IsNotEmpty()
  district: string;
  
  @IsString() @IsNotEmpty()
  fullAddress: string;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
  
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;

  @IsNumber()
  @Min(0)
  deliveryCharge: number;

  @IsBoolean()
  @IsOptional()
  useWallet?: boolean;
}
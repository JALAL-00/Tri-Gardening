// src/products/dto/create-product.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsArray,
  ValidateNested,
  IsUUID,
  IsNumber,
  IsOptional,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductStatus } from '../entities/product.entity';

// ✅ DTO for a single product variant
class CreateProductVariantDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  price: number;

  @IsNumber()
  stock: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional() // <-- Makes this field optional
  images?: string[];
}

// ✅ Main DTO for creating a product
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @IsEnum(ProductStatus)
  status: ProductStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateProductVariantDto)
  variants: CreateProductVariantDto[];
}

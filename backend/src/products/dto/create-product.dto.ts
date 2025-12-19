import {
  IsString, IsNotEmpty, IsEnum, IsArray, ValidateNested, IsUUID, IsNumber, IsOptional, ArrayMinSize, IsBoolean, IsDateString
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductStatus } from '../entities/product.entity';

class CreateProductVariantDto {
  @IsString() @IsNotEmpty()
  title: string;

  @IsNumber()
  price: number;

  @IsNumber()
  buyingPrice: number;

  @IsNumber()
  stock: number;

  @IsNumber()
  stockAlertLimit: number;

  @IsDateString()
  @IsOptional()
  expiryDate?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}

export class CreateProductDto {
  @IsString() @IsNotEmpty()
  name: string;

  @IsString() @IsNotEmpty()
  description: string;

  @IsUUID() @IsNotEmpty()
  categoryId: string;

  @IsEnum(ProductStatus)
  status: ProductStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateProductVariantDto)
  variants: CreateProductVariantDto[];

  @IsBoolean() @IsOptional()
  isFeatured?: boolean;
}

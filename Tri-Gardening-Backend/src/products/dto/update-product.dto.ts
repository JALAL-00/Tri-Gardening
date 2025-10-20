import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ProductStatus } from '../entities/product.entity';

// --- DTO for a single variant during update ---
export class UpdateProductVariantDto {
  @IsUUID()
  @IsOptional()
  id?: string; // Present if updating an existing variant

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  price: number;

  @IsNumber()
  stock: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}

// --- Main DTO for updating the product ---
export class UpdateProductDto {
  @IsUUID()
  @IsNotEmpty()
  id: string; // Required product ID for updates

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateProductVariantDto)
  @IsOptional()
  variants?: UpdateProductVariantDto[];
}

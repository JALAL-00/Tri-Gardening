import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { BlogStatus } from 'src/products/entities/blog.entity';

export class UpdateBlogDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString() @IsOptional()
  title?: string;

  @IsString() @IsOptional()
  content?: string;

  @IsString() @IsOptional()
  imageUrl?: string;

  @IsEnum(BlogStatus) @IsOptional()
  status?: BlogStatus;

  @IsUUID() @IsOptional()
  categoryId?: string;

  @IsArray() @IsUUID("all", { each: true }) @IsOptional()
  tagIds?: string[];
}
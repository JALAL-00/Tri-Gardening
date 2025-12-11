import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { BlogStatus } from 'src/products/entities/blog.entity';

export class CreateBlogDto {
  @IsString() @IsNotEmpty()
  title: string;

  @IsString() @IsNotEmpty()
  content: string;

  @IsString() @IsNotEmpty()
  imageUrl: string;

  @IsEnum(BlogStatus)
  status: BlogStatus;

  @IsUUID() @IsNotEmpty()
  categoryId: string;

  @IsArray() @IsUUID("all", { each: true }) @IsOptional()
  tagIds?: string[];
}
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';

// Use PartialType but add the required id
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
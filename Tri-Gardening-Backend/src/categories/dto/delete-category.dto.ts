import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteCategoryDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
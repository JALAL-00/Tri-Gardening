import { IsNotEmpty, IsUUID } from 'class-validator';

export class FindOneProductDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
import { IsNotEmpty, IsUUID } from 'class-validator';
export class FindOneBlogDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
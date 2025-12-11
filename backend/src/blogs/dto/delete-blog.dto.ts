import { IsNotEmpty, IsUUID } from 'class-validator';
export class DeleteBlogDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
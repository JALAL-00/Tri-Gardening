import { IsNotEmpty, IsUUID } from 'class-validator';
export class DeleteReviewDto {
  @IsUUID() @IsNotEmpty()
  id: string;
}
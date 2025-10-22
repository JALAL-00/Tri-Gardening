import { IsInt, IsNotEmpty, IsString, IsUUID, Max, Min } from 'class-validator';
export class CreateReviewDto {
  @IsUUID() @IsNotEmpty()
  productId: string;

  @IsInt() @Min(1) @Max(5) @IsNotEmpty()
  rating: number;

  @IsString() @IsNotEmpty()
  comment: string;
}
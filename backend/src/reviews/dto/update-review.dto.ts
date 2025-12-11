import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ReviewStatus } from 'src/products/entities/review.entity';
export class UpdateReviewDto {
  @IsUUID() @IsNotEmpty()
  id: string;

  @IsEnum(ReviewStatus) @IsNotEmpty()
  status: ReviewStatus;

  @IsString() @IsOptional()
  officialReply?: string;
}
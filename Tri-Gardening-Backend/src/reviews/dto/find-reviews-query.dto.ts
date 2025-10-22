import { IsEnum, IsOptional } from 'class-validator';
import { ReviewStatus } from 'src/products/entities/review.entity';
export class FindReviewsQueryDto {
  @IsEnum(ReviewStatus)
  @IsOptional()
  status?: ReviewStatus;
}
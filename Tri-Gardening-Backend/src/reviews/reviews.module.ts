import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Product } from 'src/products/entities/product.entity';
import { Review } from 'src/products/entities/review.entity';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([Review, Product]),
    AuthModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService]
})
export class ReviewsModule {}
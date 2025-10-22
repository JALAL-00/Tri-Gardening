import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from 'src/products/entities/review.entity';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { DeleteReviewDto } from './dto/delete-review.dto';
import { FindReviewsQueryDto } from './dto/find-reviews-query.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createReviewDto: CreateReviewDto, user: User): Promise<Review> {
    const { productId, rating, comment } = createReviewDto;

    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product with ID "${productId}" not found.`);
    }

    const review = this.reviewRepository.create({
      product,
      user,
      rating,
      comment,
    });

    return this.reviewRepository.save(review);
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['product', 'user'],
    });
    if (!review) {
      throw new NotFoundException(`Review with ID "${id}" not found.`);
    }
    return review;
  }

  async findAllAdmin(queryDto: FindReviewsQueryDto): Promise<Review[]> {
    const { status } = queryDto;

    const where: any = {};
    if (status) {
      where.status = status;
    }

    return this.reviewRepository.find({
      where,
      order: { createdAt: 'DESC' },
      relations: ['product', 'user'], 
    });
  }

  async update(updateReviewDto: UpdateReviewDto): Promise<Review> {
    const { id, ...dataToUpdate } = updateReviewDto;
    const review = await this.findOne(id);
    Object.assign(review, dataToUpdate);
    return this.reviewRepository.save(review);
  }

  async remove(deleteReviewDto: DeleteReviewDto): Promise<void> {
    const review = await this.findOne(deleteReviewDto.id);
    await this.reviewRepository.remove(review);
  }
}

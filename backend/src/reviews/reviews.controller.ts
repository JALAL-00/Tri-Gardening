import { Body, Controller, Post, Get, Query, Put, Delete, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { CustomerGuard } from 'src/auth/guards/customer.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { User } from 'src/users/entities/user.entity';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { FindReviewsQueryDto } from './dto/find-reviews-query.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { DeleteReviewDto } from './dto/delete-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(CustomerGuard)
  create(@Body() createReviewDto: CreateReviewDto, @GetUser() user: User) {
    return this.reviewsService.create(createReviewDto, user);
  }

  @Get('admin')
  @UseGuards(AdminGuard)
  findAllAdmin(@Query() queryDto: FindReviewsQueryDto) {
    return this.reviewsService.findAllAdmin(queryDto);
  }

  @Put('admin')
  @UseGuards(AdminGuard)
  update(@Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(updateReviewDto);
  }

  @Delete('admin')
  @UseGuards(AdminGuard)
  remove(@Body() deleteReviewDto: DeleteReviewDto) {
    return this.reviewsService.remove(deleteReviewDto);
  }
}

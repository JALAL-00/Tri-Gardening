import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { FindBlogsQueryDto } from './dto/find-blogs-query.dto';
import { FindOneBlogDto } from './dto/find-one-blog.dto';

@Controller('blogs')
export class PublicBlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  findAll(@Query() queryDto: FindBlogsQueryDto) {
    return this.blogsService.findAllPublic(queryDto);
  }

  @Post('/find-one')
  findOne(@Body() findOneBlogDto: FindOneBlogDto) {
    return this.blogsService.findOnePublic(findOneBlogDto.id);
  }
}
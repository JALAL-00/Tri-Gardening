import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { Blog } from 'src/products/entities/blog.entity';
import { Tag } from 'src/products/entities/tag.entity';
import { TagsModule } from 'src/tags/tags.module';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog, Tag]),
    AuthModule,
    CategoriesModule,
    TagsModule
  ],
  controllers: [BlogsController],
  providers: [BlogsService]
})
export class BlogsModule {}
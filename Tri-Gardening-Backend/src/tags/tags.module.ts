import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Tag } from 'src/products/entities/tag.entity';
import { TagsController } from './tags.controller';
import { PublicTagsController } from './public-tags.controller';
import { TagsService } from './tags.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tag]), AuthModule],
  controllers: [TagsController, PublicTagsController],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}

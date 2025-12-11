import { Controller, Get } from '@nestjs/common';
import { TagsService } from './tags.service';

@Controller('tags')
export class PublicTagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  findAll() {
    // We can reuse the existing service method
    return this.tagsService.findAll();
  }
}
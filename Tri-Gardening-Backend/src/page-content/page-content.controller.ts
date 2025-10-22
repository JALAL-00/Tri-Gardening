import { Controller, Get } from '@nestjs/common';
import { PageContentService } from './page-content.service';

@Controller('page-content')
export class PageContentController {
  constructor(private readonly pageContentService: PageContentService) {}

  @Get('home')
  getHomepageContent() {
    return this.pageContentService.getHomepageContent();
  }
}
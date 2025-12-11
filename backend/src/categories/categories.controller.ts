import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { DeleteCategoryDto } from './dto/delete-category.dto';

@UseGuards(AdminGuard)
@Controller('admin/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // --- CREATE ---
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  // --- FIND ALL ---
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  // --- FIND ONE ---
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.findOne(id);
  }

  // --- UPDATE ---
  // Option 1: REST-style with URL param
  // @Patch(':id')
  // update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
  //   return this.categoriesService.update(id, updateCategoryDto);
  // }

  // Option 2: Refactored DTO-based
  @Patch()
  update(@Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(updateCategoryDto.id, updateCategoryDto);
  }

  // --- REMOVE ---
  // Option 1: REST-style with URL param
  // @Delete(':id')
  // remove(@Param('id', ParseUUIDPipe) id: string) {
  //   return this.categoriesService.remove(id);
  // }

  // Option 2: Refactored DTO-based
  @Delete()
  remove(@Body() deleteCategoryDto: DeleteCategoryDto) {
    return this.categoriesService.remove(deleteCategoryDto.id);
  }
}

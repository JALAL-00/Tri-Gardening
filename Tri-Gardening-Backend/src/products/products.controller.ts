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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DeleteProductDto } from './dto/delete-product.dto';

@UseGuards(AdminGuard)
@Controller('admin/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // --- CREATE ---
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // --- FIND ALL ---
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // --- FIND ONE ---
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  // --- UPDATE (Refactored) ---
  // Now uses body DTO with internal "id" instead of path param
  @Patch()
  update(@Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(updateProductDto);
  }

  // --- REMOVE (Refactored) ---
  // Also uses body DTO instead of ":id"
  @Delete()
  remove(@Body() deleteProductDto: DeleteProductDto) {
    return this.productsService.remove(deleteProductDto);
  }
}

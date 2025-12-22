import { Body, Controller, Get, Post, Put, Query, Param, ParseUUIDPipe, Delete, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindProductsQueryDto } from './dto/find-products-query.dto';
import { FindOneProductDto } from './dto/find-one-product.dto';

@UseGuards(AdminGuard)
@Controller('admin/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProductDto: UpdateProductDto) {
    updateProductDto.id = id;
    return this.productsService.update(updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}

@Controller('products')
export class PublicProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query() queryDto: FindProductsQueryDto) {
    return this.productsService.findAllPublic(queryDto);
  }

  @Post('/find-one')
  findOne(@Body() findOneProductDto: FindOneProductDto) {
    return this.productsService.findOnePublic(findOneProductDto.id);
  }
}

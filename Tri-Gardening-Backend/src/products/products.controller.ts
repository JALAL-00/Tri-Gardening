import { Body, Controller, Get, Post, Query, Param, ParseUUIDPipe, Patch, Delete, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DeleteProductDto } from './dto/delete-product.dto';
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

  @Patch()
  update(@Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(updateProductDto);
  }

  @Delete()
  remove(@Body() deleteProductDto: DeleteProductDto) {
    return this.productsService.remove(deleteProductDto);
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
    return this.productsService.findOne(findOneProductDto.id);
  }
}

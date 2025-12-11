import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { FindOneProductDto } from './dto/find-one-product.dto';
import { FindProductsQueryDto } from './dto/find-products-query.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class PublicProductsController {
  constructor(private readonly productsService: ProductsService) {}
  
  @Get()
  findAll(@Query() queryDto: FindProductsQueryDto) {
    return this.productsService.findAllPublic(queryDto);
  }

  @Post('/find-one') // Our RPC-style endpoint
  findOne(@Body() findOneProductDto: FindOneProductDto) {
    return this.productsService.findOnePublic(findOneProductDto.id);
  }
}
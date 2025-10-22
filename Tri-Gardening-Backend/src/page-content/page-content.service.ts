import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/products/entities/category.entity';
import { Product, ProductStatus } from 'src/products/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PageContentService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getHomepageContent(): Promise<any> {
    const homepageCategories = await this.categoryRepository.find({
      take: 4,
    });

    const featuredProducts = await this.productRepository.find({
      where: {
        isFeatured: true,
        status: ProductStatus.PUBLISHED,
      },
      take: 8,
      relations: ['variants'],
    });

    const popularProducts = await this.productRepository.find({
      where: {
        status: ProductStatus.PUBLISHED,
      },
      order: {
        createdAt: 'DESC',
      },
      take: 8,
      relations: ['variants'],
    });

    return {
      sections: {
        categories: homepageCategories,
        featuredProducts: featuredProducts,
        popularProducts: popularProducts,
      },
    };
  }
}

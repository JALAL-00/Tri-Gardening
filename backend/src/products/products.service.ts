import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product, ProductStatus } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DeleteProductDto } from './dto/delete-product.dto';
import { CategoriesService } from 'src/categories/categories.service';
import { FindProductsQueryDto } from './dto/find-products-query.dto';
import { ReviewStatus } from './entities/review.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductVariant)
    private readonly variantRepository: Repository<ProductVariant>,
    private readonly categoriesService: CategoriesService,
    private readonly dataSource: DataSource,
  ) {}

  // --- ADMIN METHODS ---
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { variants: variantDtos, categoryId, ...productDto } = createProductDto;
    const category = await this.categoriesService.findOne(categoryId);
    const product = this.productRepository.create({ ...productDto, category });
    product.variants = variantDtos.map((dto) => this.variantRepository.create(dto));
    return this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({ relations: ['category', 'variants'] });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ 
      where: { id }, 
      relations: ['category', 'variants'] 
    });
    if (!product) throw new NotFoundException(`Product with ID "${id}" not found`);
    return product;
  }

  async update(updateProductDto: UpdateProductDto): Promise<Product> {
    const { id, variants, categoryId, ...productDetails } = updateProductDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = await this.findOne(id);
      if (categoryId) product.category = await this.categoriesService.findOne(categoryId);
      Object.assign(product, productDetails);

      if (variants) {
        const variantIdsToKeep = variants.map((v) => v.id).filter(Boolean);
        const variantsToDelete = product.variants.filter((v) => !variantIdsToKeep.includes(v.id));
        if (variantsToDelete.length) await queryRunner.manager.remove(variantsToDelete);

        const updatedVariants = await Promise.all(
          variants.map(async (variantDto) => {
            if (variantDto.id) {
              const existingVariant = await this.variantRepository.findOne({ where: { id: variantDto.id } });
              if (!existingVariant) throw new NotFoundException(`Variant with ID ${variantDto.id} not found.`);
              Object.assign(existingVariant, variantDto);
              return existingVariant;
            } else {
              return this.variantRepository.create(variantDto);
            }
          }),
        );
        product.variants = updatedVariants;
      }

      const updatedProduct = await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      return updatedProduct;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(deleteProductDto: DeleteProductDto): Promise<void> {
    const product = await this.findOne(deleteProductDto.id);
    await this.productRepository.remove(product);
  }

  // --- PUBLIC METHODS ---
  async findAllPublic(queryDto: FindProductsQueryDto): Promise<any> {
    const { page = 1, limit = 10, categoryId, search, minPrice, maxPrice, tagIds } = queryDto;

    const queryBuilder = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.variants', 'variants')
      .leftJoin('product.tags', 'tag') // Left join to filter without losing products
      .where('product.status = :status', { status: ProductStatus.PUBLISHED });

    if (categoryId) queryBuilder.andWhere('product.categoryId = :categoryId', { categoryId });
    if (search) queryBuilder.andWhere('product.name ILIKE :search', { search: `%${search}%` });
    if (minPrice) queryBuilder.andWhere('variants.price >= :minPrice', { minPrice });
    if (maxPrice) queryBuilder.andWhere('variants.price <= :maxPrice', { maxPrice });

    if (tagIds && tagIds.length > 0) {
      queryBuilder.andWhere('tag.id IN (:...tagIds)', { tagIds });
    }

    const [products, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    // Ensure tags are loaded even with complex joins
    for (const product of products) {
      product.tags = await this.productRepository.createQueryBuilder()
        .relation(Product, "tags")
        .of(product)
        .loadMany();
    }

    return {
      data: products,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOnePublic(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ 
      where: { id, status: ProductStatus.PUBLISHED },
      relations: ['category', 'variants', 'tags', 'reviews', 'reviews.user']
    });

    if (!product) throw new NotFoundException(`Product with ID "${id}" not found or is not published.`);

    if (product.reviews) {
      product.reviews = product.reviews.filter(review => review.status === ReviewStatus.APPROVED);
    }

    return product;
  }
}

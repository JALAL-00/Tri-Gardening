import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DeleteProductDto } from './dto/delete-product.dto';
import { CategoriesService } from 'src/categories/categories.service';

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

  // --- CREATE ---
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { variants: variantDtos, categoryId, ...productDto } = createProductDto;

    // 1. Find the category
    const category = await this.categoriesService.findOne(categoryId);

    // 2. Create the main product
    const product = this.productRepository.create({
      ...productDto,
      category,
    });

    // 3. Create the variants
    const variants = variantDtos.map((dto) =>
      this.variantRepository.create(dto),
    );
    product.variants = variants;

    // 4. Save the product with its variants (cascade)
    return this.productRepository.save(product);
  }

  // --- FIND ALL ---
  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['category', 'variants'],
    });
  }

  // --- FIND ONE ---
  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'variants'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  // --- UPDATE (Refactored for DTO-based input) ---
  async update(updateProductDto: UpdateProductDto): Promise<Product> {
    const { id, variants, categoryId, ...productDetails } = updateProductDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Fetch product
      const product = await this.findOne(id);

      // 2. Update product details
      if (categoryId) {
        const category = await this.categoriesService.findOne(categoryId);
        product.category = category;
      }
      Object.assign(product, productDetails);

      // 3. Handle variants
      if (variants) {
        const variantIdsToKeep = variants.map((v) => v.id).filter(Boolean);
        const variantsToDelete = product.variants.filter(
          (v) => !variantIdsToKeep.includes(v.id),
        );
        if (variantsToDelete.length > 0) {
          await queryRunner.manager.remove(variantsToDelete);
        }

        const updatedVariants = await Promise.all(
          variants.map(async (variantDto) => {
            if (variantDto.id) {
              const existingVariant = await this.variantRepository.findOne({
                where: { id: variantDto.id },
              });
              if (!existingVariant) {
                throw new NotFoundException(
                  `Variant with ID ${variantDto.id} not found.`,
                );
              }
              Object.assign(existingVariant, variantDto);
              return existingVariant;
            } else {
              const newVariant = this.variantRepository.create(variantDto);
              return newVariant;
            }
          }),
        );
        product.variants = updatedVariants;
      }

      // 4. Save and commit
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

  // --- REMOVE (Refactored for DTO-based input) ---
  async remove(deleteProductDto: DeleteProductDto): Promise<void> {
    const { id } = deleteProductDto;
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}

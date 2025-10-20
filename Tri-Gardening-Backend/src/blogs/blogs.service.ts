import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { Blog } from 'src/products/entities/blog.entity';
import { Tag } from 'src/products/entities/tag.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { DeleteBlogDto } from './dto/delete-blog.dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,

    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,

    private readonly categoriesService: CategoriesService,
  ) {}

  // -------------------------------
  // ✅ CREATE
  // -------------------------------
  async create(createBlogDto: CreateBlogDto, author: User): Promise<Blog> {
    const { categoryId, tagIds, ...blogDetails } = createBlogDto;

    const category = await this.categoriesService.findOne(categoryId);

    let tags: Tag[] = [];
    if (tagIds?.length) {
      tags = await this.tagRepository.findBy({ id: In(tagIds) });
    }

    const blog = this.blogRepository.create({
      ...blogDetails,
      category,
      tags,
      author,
    });

    return this.blogRepository.save(blog);
  }

  // -------------------------------
  // ✅ FIND ONE
  // -------------------------------
  async findOne(id: string): Promise<Blog> {
    const blog = await this.blogRepository.findOne({
      where: { id },
      relations: ['author', 'category', 'tags'],
    });

    if (!blog) {
      throw new NotFoundException(`Blog post with ID "${id}" not found.`);
    }

    return blog;
  }

  // -------------------------------
  // ✅ FIND ALL
  // -------------------------------
  async findAll(): Promise<Blog[]> {
    return this.blogRepository.find({
      relations: ['author', 'category', 'tags'],
      order: { createdAt: 'DESC' },
    });
  }

  // -------------------------------
  // ✅ UPDATE
  // -------------------------------
  async update(updateBlogDto: UpdateBlogDto): Promise<Blog> {
    const { id, categoryId, tagIds, ...blogDetails } = updateBlogDto;

    const blog = await this.blogRepository.preload({ id });
    if (!blog) {
      throw new NotFoundException(`Blog post with ID "${id}" not found.`);
    }

    Object.assign(blog, blogDetails);

    if (categoryId) {
      blog.category = await this.categoriesService.findOne(categoryId);
    }

    if (tagIds) {
      blog.tags = await this.tagRepository.findBy({ id: In(tagIds) });
    }

    await this.blogRepository.save(blog);
    return this.findOne(id); // Return full entity with relations
  }

  // -------------------------------
  // ✅ DELETE
  // -------------------------------
  async remove(deleteBlogDto: DeleteBlogDto): Promise<void> {
    const blog = await this.findOne(deleteBlogDto.id);
    await this.blogRepository.remove(blog);
  }
}

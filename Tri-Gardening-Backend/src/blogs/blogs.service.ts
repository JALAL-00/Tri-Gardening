import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { Blog, BlogStatus } from 'src/products/entities/blog.entity';
import { Tag } from 'src/products/entities/tag.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { DeleteBlogDto } from './dto/delete-blog.dto';
import { FindBlogsQueryDto } from './dto/find-blogs-query.dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(createBlogDto: CreateBlogDto, author: User): Promise<Blog> {
    const { categoryId, tagIds, ...blogDetails } = createBlogDto;
    const category = await this.categoriesService.findOne(categoryId);
    let tags: Tag[] = [];
    if (tagIds?.length) {
      tags = await this.tagRepository.findBy({ id: In(tagIds) });
    }
    const blog = this.blogRepository.create({ ...blogDetails, category, tags, author });
    return this.blogRepository.save(blog);
  }

  async findOne(id: string): Promise<Blog> {
    const blog = await this.blogRepository.findOne({
      where: { id },
      relations: ['author', 'category', 'tags'],
    });
    if (!blog) throw new NotFoundException(`Blog post with ID "${id}" not found.`);
    return blog;
  }

  async findAll(): Promise<Blog[]> {
    return this.blogRepository.find({
      relations: ['author', 'category', 'tags'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(updateBlogDto: UpdateBlogDto): Promise<Blog> {
    const { id, categoryId, tagIds, ...blogDetails } = updateBlogDto;
    const blog = await this.blogRepository.preload({ id });
    if (!blog) throw new NotFoundException(`Blog post with ID "${id}" not found.`);
    Object.assign(blog, blogDetails);
    if (categoryId) blog.category = await this.categoriesService.findOne(categoryId);
    if (tagIds) blog.tags = await this.tagRepository.findBy({ id: In(tagIds) });
    await this.blogRepository.save(blog);
    return this.findOne(id);
  }

  async remove(deleteBlogDto: DeleteBlogDto): Promise<void> {
    const blog = await this.findOne(deleteBlogDto.id);
    await this.blogRepository.remove(blog);
  }

  async findAllPublic(queryDto: FindBlogsQueryDto): Promise<any> {
    const { page = 1, limit = 10 } = queryDto;
    const [blogs, total] = await this.blogRepository.findAndCount({
      where: { status: BlogStatus.PUBLISHED },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['author', 'category', 'tags'],
    });
    return { data: blogs, total, page, lastPage: Math.ceil(total / limit) };
  }

  async findOnePublic(id: string): Promise<Blog> {
    const blog = await this.blogRepository.findOne({
      where: { id, status: BlogStatus.PUBLISHED },
      relations: ['author', 'category', 'tags'],
    });
    if (!blog) throw new NotFoundException(`Blog post with ID "${id}" not found or is not published.`);
    return blog;
  }
}

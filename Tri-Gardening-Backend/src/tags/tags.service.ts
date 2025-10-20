import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from 'src/products/entities/tag.entity';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { DeleteTagDto } from './dto/delete-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const tag = this.tagRepository.create(createTagDto);
    try {
      return await this.tagRepository.save(tag);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('A tag with this name already exists.');
      }
      throw error;
    }
  }
  
  async findOne(id: string): Promise<Tag> {
    const tag = await this.tagRepository.findOne({ where: { id } });
    if (!tag) {
        throw new NotFoundException(`Tag with ID "${id}" not found.`);
    }
    return tag;
  }
  
  async findAll(): Promise<Tag[]> {
      return this.tagRepository.find();
  }

  async update(updateTagDto: UpdateTagDto): Promise<Tag> {
    const { id, name } = updateTagDto;
    // Using findOne ensures we throw a 404 if the tag doesn't exist
    const tag = await this.findOne(id);
    tag.name = name;
    try {
        return await this.tagRepository.save(tag);
    } catch (error) {
        if (error.code === '23505') {
            throw new ConflictException('A tag with this name already exists.');
        }
        throw error;
    }
  }

  async remove(deleteTagDto: DeleteTagDto): Promise<void> {
    const tag = await this.findOne(deleteTagDto.id);
    await this.tagRepository.remove(tag);
  }
}
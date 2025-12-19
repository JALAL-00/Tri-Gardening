import { Controller, Post, Body, UseGuards, Get, Patch, Delete, Param, ParseUUIDPipe } from '@nestjs/common';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { DeleteTagDto } from './dto/delete-tag.dto';

@UseGuards(AdminGuard)
@Controller('admin/tags')
export class TagsController {
    constructor(private readonly tagsService: TagsService) {}

    @Post()
    create(@Body() createTagDto: CreateTagDto) {
        return this.tagsService.create(createTagDto);
    }

    @Get()
    findAll() {
        return this.tagsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.tagsService.findOne(id);
    }

    @Patch()
    update(@Body() updateTagDto: UpdateTagDto) {
        return this.tagsService.update(updateTagDto);
    }

    @Delete()
    remove(@Body() deleteTagDto: DeleteTagDto) {
        return this.tagsService.remove(deleteTagDto);
    }
}
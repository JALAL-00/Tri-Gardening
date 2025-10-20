import { Controller, Post, Body, UseGuards, Get, Param, ParseUUIDPipe, Patch, Delete } from '@nestjs/common';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { DeleteBlogDto } from './dto/delete-blog.dto';

@UseGuards(AdminGuard)
@Controller('admin/blogs')
export class BlogsController {
    constructor(private readonly blogsService: BlogsService) {}

    @Post()
    create(@Body() createBlogDto: CreateBlogDto, @GetUser() user: User) {
        return this.blogsService.create(createBlogDto, user);
    }

    @Get()
    findAll() {
        return this.blogsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.blogsService.findOne(id);
    }
    
    @Patch()
    update(@Body() updateBlogDto: UpdateBlogDto) {
        return this.blogsService.update(updateBlogDto);
    }
    
    @Delete()
    remove(@Body() deleteBlogDto: DeleteBlogDto) {
        return this.blogsService.remove(deleteBlogDto);
    }
}
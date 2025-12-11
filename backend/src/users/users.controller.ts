import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('admin/customers')
  @UseGuards(AdminGuard)
  findAllCustomers() {
    return this.usersService.findAllCustomers();
  }
}

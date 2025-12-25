import { 
  Body, 
  Controller, 
  Get, 
  Param, 
  ParseUUIDPipe, 
  Post, 
  Put, 
  Delete, 
  Query, 
  UseGuards 
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { CustomerGuard } from 'src/auth/guards/customer.guard';
import { User } from 'src/users/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { FindOrdersQueryDto } from './dto/find-orders-query.dto';
import { OrdersService } from './orders.service';
import { CreateAdminOrderDto } from './dto/create-admin-order.dto';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('orders')
  @UseGuards(CustomerGuard)
  create(@Body() createOrderDto: CreateOrderDto, @GetUser() user: User) {
    return this.ordersService.create(createOrderDto, user);
  }

  @Post('admin/orders')
  @UseGuards(AdminGuard)
  createByAdmin(@Body() createAdminOrderDto: CreateAdminOrderDto) {
    return this.ordersService.createByAdmin(createAdminOrderDto);
  }

  @Get('orders')
  @UseGuards(CustomerGuard)
  findAllForUser(@GetUser() user: User, @Query('search') searchTerm?: string) {
    return this.ordersService.findAllForUser(user, searchTerm);
  }

  @Get('orders/:id')
  @UseGuards(CustomerGuard)
  findOneForUser(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.ordersService.findOneForUser(id, user);
  }

  @Get('admin/orders')
  @UseGuards(AdminGuard)
  findAllAdmin(@Query() queryDto: FindOrdersQueryDto) {
    return this.ordersService.findAllAdmin(queryDto);
  }

  @Get('admin/orders/:id')
  @UseGuards(AdminGuard)
  findOneAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.findOneAdmin(id);
  }

  @Put('admin/orders/status')
  @UseGuards(AdminGuard)
  updateStatus(@Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(updateOrderStatusDto);
  }

  // --- ADD THIS DELETE ENDPOINT ---
  @Delete('admin/orders/:id')
  @UseGuards(AdminGuard)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.remove(id);
  }
}
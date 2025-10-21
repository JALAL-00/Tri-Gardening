import { 
  Body, 
  Controller, 
  Get, 
  Param, 
  ParseUUIDPipe, 
  Post, 
  Put, 
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

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // -------------------------------
  // 🛒 CUSTOMER: Create Order
  // -------------------------------
  @Post('orders')
  @UseGuards(CustomerGuard)
  create(@Body() createOrderDto: CreateOrderDto, @GetUser() user: User) {
    return this.ordersService.create(createOrderDto, user);
  }

  // -------------------------------
  // 🧭 ADMIN: Find All Orders with optional filtering
  // -------------------------------
  @Get('admin/orders')
  @UseGuards(AdminGuard)
  findAllAdmin(@Query() queryDto: FindOrdersQueryDto) {
    return this.ordersService.findAllAdmin(queryDto);
  }

  // -------------------------------
  // 🧾 ADMIN: Find One Order by UUID
  // -------------------------------
  @Get('admin/orders/:id')
  @UseGuards(AdminGuard)
  findOneAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.findOneAdmin(id);
  }

  // -------------------------------
  // 🚦 ADMIN: Update Order Status
  // -------------------------------
  @Put('admin/orders/status')
  @UseGuards(AdminGuard)
  updateStatus(@Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(updateOrderStatusDto);
  }
}

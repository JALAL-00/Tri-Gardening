import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, ParseUUIDPipe, Patch } from '@nestjs/common'; // <-- Add Patch
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { CustomerGuard } from 'src/auth/guards/customer.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';

@UseGuards(CustomerGuard)
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  create(@Body() createAddressDto: CreateAddressDto, @GetUser() user: User) {
    return this.addressesService.create(createAddressDto, user);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.addressesService.findAllForUser(user);
  }

  @Patch(':id/default')
  setDefault(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.addressesService.setDefault(id, user);
  }

  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateAddressDto: UpdateAddressDto, @GetUser() user: User) {
    return this.addressesService.update(id, updateAddressDto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.addressesService.remove(id, user);
  }
}
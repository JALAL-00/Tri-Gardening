import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Res, UseGuards } from '@nestjs/common';
import { CustomerGuard } from 'src/auth/guards/customer.guard';
import { ChatDto } from './dto/chat.dto';
import { PlantClinicService } from './plant-clinic.service';
import express from 'express';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('plant-clinic')
@UseGuards(CustomerGuard) // Protect all routes in this controller
export class PlantClinicController {
  constructor(private readonly plantClinicService: PlantClinicService) {}

  @Get('sessions')
  listSessions(@GetUser() user: User) {
    return this.plantClinicService.listSessions(user);
  }

  @Get('sessions/:id')
  getSession(
    @Param('id', ParseUUIDPipe) id: string, 
    @GetUser() user: User
  ) {
    return this.plantClinicService.getSession(id, user);
  }

  @Post('chat')
  async chat(
    @Body() chatDto: ChatDto,
    @GetUser() user: User,
    @Res() res: express.Response,
  ) {
    res.setHeader('Content-Type', 'text/plain'); // Set for streaming
    const stream = await this.plantClinicService.generateContentStream(chatDto, user);
    stream.pipe(res);
  }
}
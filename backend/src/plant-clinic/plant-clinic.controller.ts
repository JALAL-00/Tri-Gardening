import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { CustomerGuard } from 'src/auth/guards/customer.guard';
import { ChatDto } from './dto/chat.dto';
import { PlantClinicService } from './plant-clinic.service';
import express from 'express';

@Controller('plant-clinic')
export class PlantClinicController {
  constructor(private readonly plantClinicService: PlantClinicService) {}

  @Post('chat')
  @UseGuards(CustomerGuard) 
  async chat(
    @Body() chatDto: ChatDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    res.setHeader('Content-Type', 'text/plain'); 
    const stream = await this.plantClinicService.generateContentStream(chatDto);
    
    stream.pipe(res);
  }
}
import { Module } from '@nestjs/common';
import { PlantClinicService } from './plant-clinic.service';
import { PlantClinicController } from './plant-clinic.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatSession } from './entities/chat-session.entity';
import { ChatMessage } from './entities/chat-message.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([ChatSession, ChatMessage]),
  ],
  providers: [PlantClinicService],
  controllers: [PlantClinicController]
})
export class PlantClinicModule {}
import { Module } from '@nestjs/common';
import { PlantClinicService } from './plant-clinic.service';
import { PlantClinicController } from './plant-clinic.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule], // Import AuthModule to use the CustomerGuard
  providers: [PlantClinicService],
  controllers: [PlantClinicController]
})
export class PlantClinicModule {}
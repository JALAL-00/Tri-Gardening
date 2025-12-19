import { Test, TestingModule } from '@nestjs/testing';
import { PlantClinicService } from './plant-clinic.service';

describe('PlantClinicService', () => {
  let service: PlantClinicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlantClinicService],
    }).compile();

    service = module.get<PlantClinicService>(PlantClinicService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { PlantClinicController } from './plant-clinic.controller';

describe('PlantClinicController', () => {
  let controller: PlantClinicController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlantClinicController],
    }).compile();

    controller = module.get<PlantClinicController>(PlantClinicController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { CompanysController } from './companys.controller';
import { CompanysService } from './companys.service';

describe('CompanysController', () => {
  let controller: CompanysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanysController],
      providers: [CompanysService],
    }).compile();

    controller = module.get<CompanysController>(CompanysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

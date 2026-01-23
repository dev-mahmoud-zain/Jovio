import { Test, TestingModule } from '@nestjs/testing';
import { JobOpportunityController } from './job-opportunity.controller';
import { JobOpportunityService } from './job-opportunity.service';

describe('JobOpportunityController', () => {
  let controller: JobOpportunityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobOpportunityController],
      providers: [JobOpportunityService],
    }).compile();

    controller = module.get<JobOpportunityController>(JobOpportunityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { JobOpportunityService } from './job-opportunity.service';

describe('JobOpportunityService', () => {
  let service: JobOpportunityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobOpportunityService],
    }).compile();

    service = module.get<JobOpportunityService>(JobOpportunityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

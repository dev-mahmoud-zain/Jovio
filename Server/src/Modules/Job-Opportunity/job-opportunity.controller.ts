import { Controller } from '@nestjs/common';
import { JobOpportunityService } from './job-opportunity.service';

@Controller('job-opportunity')
export class JobOpportunityController {
  constructor(private readonly jobOpportunityService: JobOpportunityService) {}
}

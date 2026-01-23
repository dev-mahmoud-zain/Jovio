import { Module } from '@nestjs/common';
import { JobOpportunityService } from './job-opportunity.service';
import { JobOpportunityController } from './job-opportunity.controller';

@Module({
  controllers: [JobOpportunityController],
  providers: [JobOpportunityService],
})
export class JobOpportunityModule {}

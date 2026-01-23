import { Module } from '@nestjs/common';
import { CompanysService } from './companys.service';
import { CompanysController } from './companys.controller';

@Module({
  controllers: [CompanysController],
  providers: [CompanysService],
})
export class CompanysModule {}

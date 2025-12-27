import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { CommonModule, DatabaseModule } from 'src/common/modules';
import { CompanyRepository } from 'src/DATABASE/repository/company.repository';
import { CompanyModel } from 'src/DATABASE';

@Module({

  imports:[DatabaseModule,CommonModule,CompanyModel],
  controllers: [CompanyController],
  providers: [CompanyService,CompanyRepository],
})
export class CompanyModule {}

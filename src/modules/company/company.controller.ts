import { Body, Controller, Post, Request, UsePipes, ValidationPipe } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Auth, TokenTypeEnum } from 'src/common';
import type { IRequest } from 'src/common';
import { Types } from 'mongoose';
import { CreateCompanyDto } from './dto/create-company.dto';


@Auth([],TokenTypeEnum.access)
@UsePipes(new ValidationPipe({
  whitelist:true,
  forbidNonWhitelisted:true
}))
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post("create")
  createCompany(
  @Request() req:IRequest,
  @Body() data:CreateCompanyDto
  ){

    return this.companyService.createCompany(req.credentials?.user._id as Types.ObjectId ,
      data 
    )
  }



}
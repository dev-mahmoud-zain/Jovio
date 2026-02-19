import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { SuccessResponse } from 'src/Common/Utils/Response/success.response';
import { AuthenticationGuard } from 'src/Common/Guards/Authentication/authentication.guard';
import type { I_Request } from 'src/Common/Interfaces/request.interface';
import { CreateCompanyDto } from './dto/create.company.dto';
import { GetCompanyByIdDto, SearchCompaniesDto } from './dto/get.companies.dto';
import { UpdateCompanyDto } from './dto/update.company.dto';


@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) { }




  // ==================================== Company Profile Management ====================================


  // ===> Create A New Company

  @UseGuards(AuthenticationGuard)
  @Post("create")
  async createCompany(
    @Req() req: I_Request,
    @Body() data: CreateCompanyDto
  ) {


    const company = await this.companiesService.createCompany(req.credentials.user!._id!, data)


    return SuccessResponse({
      message: "Company Created Successfully",
      data: company
    })


  }



  // ===> Update Company Basic Info

  @UseGuards(AuthenticationGuard)
  @Patch("update/:companyId")
  async updateCompany(
    @Req() req: I_Request,
    @Param() param: GetCompanyByIdDto,
    @Body() data: UpdateCompanyDto
  ) {


    const company = await this.companiesService.updateCompany(
      req.credentials.user!._id!,
      param.companyId,
      data)

    return SuccessResponse({
      message: "Company Updated Success",
      data:company
    })
  }


  // ======================================= Companies Retrieval =======================================


  // ===> Search Companies


  @Get("search")
  async searchCompanies(
    @Query() keys: SearchCompaniesDto
  ) {


    const data = await this.companiesService.searchCompanies(keys);

    return SuccessResponse({
      data
    })
  }


  // ===> Get Company By Id

  @Get(":companyId")
  async getCompanyById(
    @Param() param: GetCompanyByIdDto
  ) {

    const company = await this.companiesService.getCompanyById(param.companyId)

    return SuccessResponse({
      data: company
    })
  }






}

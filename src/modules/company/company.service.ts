import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CompanyRepository } from 'src/DATABASE/repository/company.repository';
import { ExceptionFactory, SuccessResponse } from 'src/common';
import { CompanyStatus } from 'src/common/enums/company.enum';

@Injectable()
export class CompanyService {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly errorResponse: ExceptionFactory,
  ) {}

  async createCompany(userId: Types.ObjectId, data: CreateCompanyDto) {
    const message = 'Fail To Create Company';

    const [emailExists, nameExists] = await Promise.all([
      this.companyRepository.findOne({
        filter: {
          companyEmail: data.companyEmail,
        },
      }),

      this.companyRepository.findOne({
        filter: {
          companyName: data.companyName,
        },
      }),
    ]);

    if (emailExists) {
      throw this.errorResponse.badRequest({
        message,
        issus: [
          {
            path: 'companyEmail',
            info: 'This Email Already Exists',
          },
        ],
      });
    }

    if (nameExists) {
      throw this.errorResponse.badRequest({
        message,
        issus: [
          {
            path: 'name',
            info: 'This Name Already Exists',
          },
        ],
      });
    }


    const [company] = await this.companyRepository.create({
        data:[{
            ...data,
            createdBy:userId,
            status : CompanyStatus.PENDING
        }]
    })||[]


    return SuccessResponse({
        statusCode:201,
        data:company
    });
  }


   async updateCompanyData(userId: Types.ObjectId, data: CreateCompanyDto) {
    const message = 'Fail To Create Company';

    const [emailExists, nameExists] = await Promise.all([
      this.companyRepository.findOne({
        filter: {
          companyEmail: data.companyEmail,
        },
      }),

      this.companyRepository.findOne({
        filter: {
          companyName: data.companyName,
        },
      }),
    ]);

    if (emailExists) {
      throw this.errorResponse.badRequest({
        message,
        issus: [
          {
            path: 'companyEmail',
            info: 'This Email Already Exists',
          },
        ],
      });
    }

    if (nameExists) {
      throw this.errorResponse.badRequest({
        message,
        issus: [
          {
            path: 'name',
            info: 'This Name Already Exists',
          },
        ],
      });
    }


    const [company] = await this.companyRepository.create({
        data:[{
            ...data,
            createdBy:userId,
            status : CompanyStatus.PENDING
        }]
    })||[]


    return SuccessResponse({
        statusCode:201,
        data:company
    });
  }


}

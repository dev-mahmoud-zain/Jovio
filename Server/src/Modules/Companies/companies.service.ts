import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { CreateCompanyDto } from './dto/create.company.dto';
import { CompanyRepository } from 'src/Database/Repository/company.repository';
import { ExceptionFactory } from 'src/Common/Utils/Response/error.response';
import { EncryptionService } from 'src/Common/Utils/Security/encryption';
import { SearchCompaniesDto } from './dto/get.companies.dto';
import { UpdateCompanyDto } from './dto/update.company.dto';
import { Company } from 'src/Database/Models/company.model';

const ErrorResponse = new ExceptionFactory()

@Injectable()
export class CompaniesService {

    constructor(
        private readonly companyRepository: CompanyRepository,
        private readonly encryptionService: EncryptionService
    ) {

    }


    private formatCompany(company: Company) {

        company.name = company.name.split(" ")
            .map(word =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(" ");

        company.email = this.encryptionService.decrypt(company.email);
        company.phone = company.phone && this.encryptionService.decrypt(company.phone);
        return company
    }


    // ==================================== Company Profile Management ====================================

    // ===> Create A New Company

    async createCompany(owner: Types.ObjectId, data: CreateCompanyDto) {

        data.name = data.name.toLowerCase()

        const [nameExists, emailExists, phoneExists] = await Promise.all([

            this.companyRepository.findOne({
                filter: {
                    name: data.name
                },
                getFreezed: true
            }),

            this.companyRepository.findByEmail({
                email: data.email,
                getFreezed: true
            }),

            data.phone && this.companyRepository.findByPhone({
                phone: data.phone,
                getFreezed: true
            })

        ])

        const issues: {
            path: string,
            info: string
        }[] = []

        if (nameExists) {
            issues.push({
                path: "name",
                info: `This Company Name [${data.name}] Is Exists`
            })
        }

        if (emailExists) {
            issues.push({
                path: "email",
                info: `This Company Email [${data.email}] Is Exists`
            })
        }

        if (phoneExists) {
            issues.push({
                path: "phone",
                info: `This Company Phone [${data.phone}]  Is Exists`
            })
        }

        if (issues.length) {
            throw ErrorResponse.conflict({
                message: "Fail To Create A new Company",
                issues
            })
        }

        if (data.phone) {
            data.phone = this.encryptionService.encrypt(data.phone)
        }
        data.email = this.encryptionService.encrypt(data.email)

        const [company] = await this.companyRepository.create({
            data: [{
                owner,
                ...data
            }]
        }) || []

        if (!company) {
            throw ErrorResponse.serverError({ message: "Fail To Create Company , Please Try Again" })
        }

        return this.formatCompany(company)
    }

    // ===> Update Company Basic Info

    async updateCompany(userId: Types.ObjectId, companyId: Types.ObjectId, data: UpdateCompanyDto) {

        const validData = Object.values(data).filter(
            (value) => value !== undefined && value !== null
        );

        if (!validData.length) {
            throw ErrorResponse.badRequest({
                message: "At least one field is required"
            });
        }

        const company = await this.companyRepository.findById({
            id: companyId
        })

        if (!company) {
            throw ErrorResponse.notFound({
                message: `No Company Matched With Id [${companyId}]`
            })
        }

        const isAdmin = company.admins?.some(
            (adminId) => adminId.toString() === userId.toString()
        );

        if (!isAdmin && company.owner.toString() !== userId.toString()) {
            throw ErrorResponse.forbidden({
                message: "You are not allowed to update this company"
            })
        }

        const updatePayload: Partial<Company> = {};

        if (data.name) updatePayload.name = data.name;

        if (data.email) updatePayload.email = this.encryptionService.encrypt(data.email);

        if (data.phone) updatePayload.phone = this.encryptionService.encrypt(data.phone);

        if (data.description) updatePayload.description = data.description;

        if (data.industry) updatePayload.industry = data.industry;

        if (data.size) updatePayload.size = data.size;

        if (data.foundedAt) updatePayload.foundedAt = data.foundedAt;

        if (data.location) updatePayload.location = data.location;


        const updatedCompany = await this.companyRepository.findOneAndUpdate({
            filter: { _id: companyId },
            update: updatePayload,
        });

        if (!updatedCompany) {
            throw ErrorResponse.serverError({
                message: "Fail To Update Company"
            })
        }

        return this.formatCompany(updatedCompany)

    }

    // ======================================= Companies Retrieval =======================================

    // ===> Search Companies

    async searchCompanies(keys: SearchCompaniesDto) {

        const validFilters = Object.values(keys).filter(
            (value) => value !== undefined && value !== null
        );

        if (!validFilters.length) {
            throw ErrorResponse.badRequest({
                message: "At least one search parameter is required"
            });
        }

        const filters: Record<string, any> = {};

        if (keys.name) {
            filters.name = { $regex: keys.name, $options: "i" };
        }

        if (keys.email) {
            filters.email = { $regex: this.encryptionService.encrypt(keys.email), $options: "i" };
        }
        if (keys.phone) {
            filters.phone = { $regex: this.encryptionService.encrypt(keys.phone), $options: "i" };
        }

        if (keys.slug) {
            filters.slug = { $regex: keys.slug, $options: "i" };
        }

        if (keys.industry) {
            filters.industry = { $regex: keys.industry, $options: "i" };
        }

        if (keys.city) {
            filters["location.city"] = { $regex: keys.city, $options: "i" };
        }

        if (keys.country) {
            filters["location.country"] = { $regex: keys.country, $options: "i" };
        }

        const companies = await this.companyRepository.find({
            filter: filters
        })

        return companies

    }

    // ===> Get Company By Id

    async getCompanyById(companyId: Types.ObjectId,) {
        const company = await this.companyRepository.findById({
            id: companyId
        })

        if (!company) {
            throw ErrorResponse.notFound({
                message: `No Company Matched With Id [${companyId}]`
            })
        }

        return this.formatCompany(company)
    }

}
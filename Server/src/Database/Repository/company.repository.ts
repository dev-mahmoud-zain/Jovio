import { ExceptionFactory } from "src/Common/Utils/Response/error.response";
import { DatabaseRepository } from "./base.repository";
import { InjectModel } from "@nestjs/mongoose";
import { Model, QueryOptions } from "mongoose";
import { Company, H_CompanyDocument } from "../Models/company.model";
import { EncryptionService } from "src/Common/Utils/Security/encryption";


const ErrorResponse = new ExceptionFactory();

export class CompanyRepository extends DatabaseRepository<Company> {
    constructor(

        @InjectModel(Company.name)
        protected override readonly model: Model<H_CompanyDocument>,
        private readonly encryptionService: EncryptionService,

    ) {
        super(model);
    }


    async findByEmail({
        email,
        select,
        options,
        getFreezed,
    }: {
        email: string;
        select?:
        | string
        | readonly string[]
        | Record<string, number | boolean | string | object>;
        options?: QueryOptions<Company>;
        getFreezed?: boolean;
    }) {
        return this.findOne({
            filter: {
                email: this.encryptionService.encrypt(email),
            },
            select,
            options,
            getFreezed,
        });
    }


    async findByPhone({
        phone,
        select,
        options,
        getFreezed,
    }: {
        phone: string;
        select?:
        | string
        | readonly string[]
        | Record<string, number | boolean | string | object>;
        options?: QueryOptions<Company>;
        getFreezed?: boolean;
    }) {
        return this.findOne({
            filter: {
                phone: this.encryptionService.encrypt(phone),
            },
            select,
            options,
            getFreezed,
        });
    }

}
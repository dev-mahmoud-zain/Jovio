import { InjectModel } from "@nestjs/mongoose";
import { DatabaseRepository } from "./database.repository";
import { Model } from "mongoose";
import {  Company, CompanyDocument } from "../models";

export class CompanyRepository extends DatabaseRepository<Company> {

    constructor(
        @InjectModel(Company.name)
        protected override readonly model: Model<CompanyDocument>
    ) {
        super(model)
    }

}
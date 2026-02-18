import { configField, PickFromDtos } from "src/Common/Validation/generic-picker.validation";
import { BaseCompanyDto } from "./base.company.dto";
import { IsOptional, IsString, Matches } from "class-validator";
import { Transform } from "class-transformer";

const getCompanyFields = [
    configField({ source: BaseCompanyDto, name: "companyId", isRequired: true })
]


export class GetCompanyByIdDto extends PickFromDtos(getCompanyFields) {

}



const searchCompaniesFields = [
    configField({ source: BaseCompanyDto, name: "email", isRequired: false }),
    configField({ source: BaseCompanyDto, name: "industry", isRequired: false }),
]


export class SearchCompaniesDto extends PickFromDtos(searchCompaniesFields) {
    
    @IsOptional()
    @IsString()
    name:string;

    @IsOptional()
    @Matches(/^[a-z]+(-[a-z]+)*$/, {
        message: "Slug must be lowercase words separated by single hyphens"
    })
    @IsString()
    slug: string;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => {
        if (!value) return value;
        let phone = value.toString().trim();

        phone = phone.replace(/^(\+)?/, "");

        if (!phone.startsWith("20")) {
            phone = "20" + phone;
        }
        return "+" + phone;
    })
    @Matches(/^\+20(10|11|12|15)\d{8}$/, {
        message: "Phone must be a valid Egyptian mobile number",
    })
    phone: string;

}
import { configField, PickFromDtos } from "src/Common/Validation/generic-picker.validation";
import { BaseCompanyDto } from "./base.company.dto";

const createCompanyFields = [
    configField({ source: BaseCompanyDto, name: "name", isRequired: true }),
    configField({ source: BaseCompanyDto, name: "email", isRequired: true }),
    configField({ source: BaseCompanyDto, name: "phone", isRequired: false }),
    configField({ source: BaseCompanyDto, name: "description", isRequired: true }),
    configField({ source: BaseCompanyDto, name: "industry", isRequired: true }),
    configField({ source: BaseCompanyDto, name: "size", isRequired: true }),
    configField({ source: BaseCompanyDto, name: "foundedAt", isRequired: false }),
    configField({ source: BaseCompanyDto, name: "location", isRequired: true }),
]


export class CreateCompanyDto extends PickFromDtos(createCompanyFields){

}
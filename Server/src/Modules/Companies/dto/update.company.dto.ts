import { configField, PickFromDtos } from "src/Common/Validation/generic-picker.validation";
import { BaseCompanyDto } from "./base.company.dto";

const updateCompanyFields = [
    configField({ source: BaseCompanyDto, name: "name", isRequired: false }),
    configField({ source: BaseCompanyDto, name: "email", isRequired: false }),
    configField({ source: BaseCompanyDto, name: "phone", isRequired: false }),
    configField({ source: BaseCompanyDto, name: "description", isRequired: false }),
    configField({ source: BaseCompanyDto, name: "industry", isRequired: false }),
    configField({ source: BaseCompanyDto, name: "size", isRequired: false }),
    configField({ source: BaseCompanyDto, name: "foundedAt", isRequired: false }),
    configField({ source: BaseCompanyDto, name: "location", isRequired: false }),
]


export class UpdateCompanyDto extends PickFromDtos(updateCompanyFields) {

}
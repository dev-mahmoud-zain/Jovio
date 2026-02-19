import { defineFields, PickFromDtos } from "src/Common/Validation/generic-picker.validation";
import { BaseCompanyDto } from "./base.company.dto";

const createCompanyFields = defineFields([
    { source: BaseCompanyDto, name: "name", isRequired: true },
    { source: BaseCompanyDto, name: "email", isRequired: true },
    { source: BaseCompanyDto, name: "phone", isRequired: true },
    { source: BaseCompanyDto, name: "description", isRequired: true },
    { source: BaseCompanyDto, name: "industry", isRequired: true },
    { source: BaseCompanyDto, name: "size", isRequired: true },
    { source: BaseCompanyDto, name: "foundedAt", isRequired: true },
    { source: BaseCompanyDto, name: "location", isRequired: true },
])

export class CreateCompanyDto extends PickFromDtos(createCompanyFields) {
}
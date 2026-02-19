import { defineFields, PickFromDtos } from "src/Common/Validation/generic-picker.validation";
import { BaseCompanyDto } from "./base.company.dto";

const updateCompanyFields = defineFields([
    { source: BaseCompanyDto, name: "name", isRequired: false },
    { source: BaseCompanyDto, name: "email", isRequired: false },
    { source: BaseCompanyDto, name: "phone", isRequired: false },
    { source: BaseCompanyDto, name: "description", isRequired: false },
    { source: BaseCompanyDto, name: "industry", isRequired: false },
    { source: BaseCompanyDto, name: "size", isRequired: false },
    { source: BaseCompanyDto, name: "foundedAt", isRequired: false },
    { source: BaseCompanyDto, name: "location", isRequired: false },

] as const)

export class UpdateCompanyDto extends PickFromDtos(updateCompanyFields) {
}
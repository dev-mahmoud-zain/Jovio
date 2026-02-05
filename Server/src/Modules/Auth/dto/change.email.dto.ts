import { PickType } from "@nestjs/mapped-types";
import { GeneralFieldsDto } from "src/Common/Validation/general.fields.dto";



export class ChangeEmailReqDto extends PickType(GeneralFieldsDto, [
    'email',
    'password',
]) {

}


export class ConfirmChangeEmailDto extends PickType(GeneralFieldsDto, [
    'otpCode',
]) {

}
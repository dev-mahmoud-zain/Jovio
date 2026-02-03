import { PickType } from '@nestjs/mapped-types';
import { IsMatch } from 'src/Common/Validation/custom.validator';
import { GeneralFieldsDto } from 'src/Common/Validation/general.fields.dto';

export class ForgetPasswordDto extends PickType(GeneralFieldsDto, [
    'email',
]) {
}

export class ConfirmResetPasswordDto extends PickType(GeneralFieldsDto, [
    'email',
    'otpCode',
    'password',
]) {

    @IsMatch("password")
    confirmPassword: string
}
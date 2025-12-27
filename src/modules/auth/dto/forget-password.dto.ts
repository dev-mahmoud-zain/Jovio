import { PickType } from '@nestjs/mapped-types';
import { IsString, IsStrongPassword } from 'class-validator';
import { IsMatch } from 'src/common';
import { GeneralFields } from 'src/common/general-fields';

export class ForgetPasswordDto extends PickType(GeneralFields, ['email']) {}

export class ReSetPasswordDto extends PickType(GeneralFields, [
  'email',
  'OTP_Code',
  'password',
]) {
  @IsMatch('password')
  confirmPassword: string;
}
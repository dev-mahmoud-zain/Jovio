import {
  PickFromDtos,
  configField,
} from 'src/Common/Validation/generic-picker.validation';
import { BaseUserDto } from 'src/Modules/Users/dto/base-user.dto';
import { BaseAuthDto } from './base-auth.dto';
import { IsMatch } from 'src/Common/Decorators/isMatch.decorator';

const forgetPasswordFields = [
  configField({ source: BaseUserDto, name: 'email', isRequired: true }),
];

export class ForgetPasswordDto extends PickFromDtos(forgetPasswordFields) {}

const confirmResetFields = [
  configField({ source: BaseUserDto, name: 'email', isRequired: true }),
  configField({ source: BaseAuthDto, name: 'otpCode', isRequired: true }),
  configField({ source: BaseUserDto, name: 'password', isRequired: true }),
];

export class ConfirmResetPasswordDto extends PickFromDtos(confirmResetFields) {
  @IsMatch('password')
  confirmPassword: string;
}

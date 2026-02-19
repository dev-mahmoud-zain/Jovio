import {
  PickFromDtos,
  defineFields,
} from 'src/Common/Validation/generic-picker.validation';
import { BaseUserDto } from 'src/Modules/Users/dto/base-user.dto';
import { BaseAuthDto } from './base-auth.dto';
import { IsMatch } from 'src/Common/Decorators/isMatch.decorator';

const forgetPasswordFields = defineFields([
  { source: BaseUserDto, name: 'email', isRequired: true },
] as const);

export class ForgetPasswordDto extends PickFromDtos(forgetPasswordFields) {}

const confirmResetFields = defineFields([
  { source: BaseUserDto, name: 'email', isRequired: true },
  { source: BaseAuthDto, name: 'otpCode', isRequired: true },
  { source: BaseUserDto, name: 'password', isRequired: true },
] as const);

export class ConfirmResetPasswordDto extends PickFromDtos(confirmResetFields) {
  @IsMatch('password')
  confirmPassword: string;
}

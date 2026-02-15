import { BaseUserDto } from 'src/Modules/Users/dto/base-user.dto';
import { BaseAuthDto } from './base-auth.dto';
import {
  PickFromDtos,
  configField,
} from 'src/Common/Validation/generic-picker.validation';

const changeEmailFields = [
  configField({ source: BaseUserDto, name: 'email', isRequired: true }),
  configField({ source: BaseUserDto, name: 'password', isRequired: true }),
];

export class ChangeEmailReqDto extends PickFromDtos(changeEmailFields) {}

const confirmEmailFields = [
  configField({ source: BaseAuthDto, name: 'otpCode', isRequired: true }),
];

export class ConfirmChangeEmailDto extends PickFromDtos(confirmEmailFields) {}

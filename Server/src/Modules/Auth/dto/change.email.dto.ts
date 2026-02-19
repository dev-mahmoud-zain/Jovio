import { BaseUserDto } from 'src/Modules/Users/dto/base-user.dto';
import { BaseAuthDto } from './base-auth.dto';
import {
  PickFromDtos,
  defineFields,
} from 'src/Common/Validation/generic-picker.validation';

const changeEmailFields = defineFields([
  { source: BaseUserDto, name: 'email', isRequired: true },
  { source: BaseUserDto, name: 'password', isRequired: true },
] as const);

export class ChangeEmailReqDto extends PickFromDtos(changeEmailFields) {}

const confirmEmailFields = defineFields([
  { source: BaseAuthDto, name: 'otpCode', isRequired: true },
] as const);

export class ConfirmChangeEmailDto extends PickFromDtos(confirmEmailFields) {}

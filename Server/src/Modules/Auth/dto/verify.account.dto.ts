import { BaseUserDto } from 'src/Modules/Users/dto/base-user.dto';
import { BaseAuthDto } from './base-auth.dto';
import {
  PickFromDtos,
  defineFields,
} from 'src/Common/Validation/generic-picker.validation';

const verifyFields = defineFields([
  { source: BaseUserDto, name: 'email', isRequired: true },
  { source: BaseAuthDto, name: 'otpCode', isRequired: true }
] as const );

export class VerifyAccountDto extends PickFromDtos(verifyFields) {}

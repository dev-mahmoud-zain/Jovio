import { IsString, IsOptional, MaxLength } from 'class-validator';
import { UserDefinitions } from '../Definitions/user.definitions';
import { BaseUserDto } from './base-user.dto';
import {
  PickFromDtos,
  defineFields,
} from 'src/Common/Validation/generic-picker.validation';

const deleteAccountFields = defineFields([
  {
    source: BaseUserDto,
    name: 'password',
    isRequired: true,
  },
] as const);

export class DeleteAccountDto extends PickFromDtos(deleteAccountFields) {
  @IsOptional()
  @IsString()
  @MaxLength(UserDefinitions.LIMITS.bio.MAX)
  reason?: string;
}

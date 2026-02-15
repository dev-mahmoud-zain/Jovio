import { IsString, IsOptional, MaxLength } from 'class-validator';
import { UserDefinitions } from '../Definitions/user.definitions';
import { BaseUserDto } from './base-user.dto';
import {
  PickFromDtos,
  configField,
} from 'src/Common/Validation/generic-picker.validation';

const deleteAccountFields = [
  configField({ source: BaseUserDto, name: 'password', isRequired: true }),
];

export class DeleteAccountDto extends PickFromDtos(deleteAccountFields) {
  @IsOptional()
  @IsString()
  @MaxLength(UserDefinitions.LIMITS.bio.MAX)
  reason?: string;
}

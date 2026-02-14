import { IsString, IsOptional, MaxLength } from 'class-validator';
import { UserDefinitions } from '../Definitions/user.definitions';
import { PickType } from '@nestjs/mapped-types';
import { BaseUser } from './base-user.dto';

export class DeleteAccountDto extends PickType(BaseUser, ['password']) {
  @IsOptional()
  @IsString()
  @MaxLength(UserDefinitions.LIMITS.bio.MAX)
  reason?: string;
}

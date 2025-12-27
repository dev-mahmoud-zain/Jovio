import { PickType } from '@nestjs/mapped-types';

import { IsOptional, ValidateIf } from 'class-validator';
import { IsMatch, UserStatusEnum } from 'src/common';
import { GeneralFields } from 'src/common/general-fields';

export class SignUpDto extends PickType(GeneralFields, [
  'userName',
  'email',
  'password',
  'gender',
  'phone',
  'dateOfBirth',
  'status',
]) {
  @ValidateIf((data: SignUpDto) => {
    return Boolean(data.password);
  })
  @IsMatch('password')
  confirmPassword: string;

  @IsOptional()
  status:UserStatusEnum;
}
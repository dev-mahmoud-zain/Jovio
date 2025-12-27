import { PartialType, PickType } from '@nestjs/mapped-types';
import { IsString, IsStrongPassword } from 'class-validator';
import { GeneralFields, IsMatch, IsNotEqual } from 'src/common';

export class UpdateUserDto extends PartialType(
  PickType(GeneralFields, [
    'userName',
    'phone',
    'gender',
    'dateOfBirth',
    `status`,
  ]),
) {}

export class UpdateEmailDto extends PickType(GeneralFields, [
  'email',
  'password',
]) {}

export class ConfirmUpdateEmailDto extends PickType(GeneralFields, [
  'OTP_Code',
]) {}

export class UpdatePasswordDto {
  @IsStrongPassword()
  @IsString()
  password: string;

  @IsNotEqual(["password"],{
    message:"New Password Must Be Different From The Old One"
  })
  @IsStrongPassword()
  @IsString()
  newPassword: string;


  @IsMatch('newPassword')
  confirmNewPassword: string;
}
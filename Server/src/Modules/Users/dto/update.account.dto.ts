import { PickType } from '@nestjs/mapped-types';
import {
  ArrayMaxSize,
  IsArray,
  IsObject,
  IsString,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';
import { GeneralFieldsDto } from 'src/Common/Validation/general.fields.dto';
import { UserDefinitions } from '../Definitions/user.definitions';
import * as userSocialInterface from 'src/Common/Interfaces/user.social.interface';
import * as fileInterface from 'src/Common/Interfaces/file.interface';

export class UpdateAccountDto extends PickType(GeneralFieldsDto, [
  'password',
  'gender',
  'userStatus',
]) {
  @IsString()
  @Matches(UserDefinitions.REGEX.PHONE, {
    message: 'Invalid phone number format',
  })
  phoneNumber: string;

  @IsString()
  @Matches(UserDefinitions.REGEX.DATE_STRING, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  dateOfBirth: string;

  @IsString()
  @MinLength(UserDefinitions.LIMITS.firstName.MIN)
  @MaxLength(UserDefinitions.LIMITS.firstName.MAX)
  firstName: string;

  @IsString()
  @MinLength(UserDefinitions.LIMITS.lastName.MIN)
  @MaxLength(UserDefinitions.LIMITS.lastName.MAX)
  lastName: string;

  @IsString()
  @MaxLength(UserDefinitions.LIMITS.bio.MAX)
  bio: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(UserDefinitions.LIMITS.skills.MAX_ITEMS)
  skills: string[];

  @IsObject()
  socialLinks: userSocialInterface.I_UserSocial;

  @IsObject()
  profilePicture: fileInterface.I_File;

  @IsObject()
  coverPicture: fileInterface.I_File;

  @IsObject()
  resume: fileInterface.I_File;
}

import {
  IsEmail,
  Matches,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
  ArrayMaxSize,
  IsArray,
  IsObject,
} from 'class-validator';
import { GenderEnum } from 'src/Common/Enums/gender.enum';
import { UserStatusEnum } from 'src/Common/Enums/user.status.enum';
import { UserDefinitions } from '../Definitions/user.definitions';
import * as userSocialInterface from 'src/Common/Interfaces/user.social.interface';
import * as fileInterface from 'src/Common/Interfaces/file.interface';
import { UserErrors } from '../Errors/user.error';

export class BaseUserDto {
  @Matches(UserDefinitions.REGEX.FULL_NAME, {
    message: UserErrors.FULL_NAME,
  })
  @MaxLength(UserDefinitions.LIMITS.fullName.MAX)
  @MinLength(UserDefinitions.LIMITS.fullName.MIN)
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @Matches(UserDefinitions.REGEX.PHONE_NUMBER, {
    message: UserErrors.PHONE_NUMBER,
  })
  phoneNumber: string;

  @Matches(UserDefinitions.REGEX.PASSWORD, {
    message: UserErrors.PASSWORD,
  })
  password: string;

  @MaxLength(UserDefinitions.LIMITS.bio.MAX)
  @IsString()
  bio: string;

  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @IsString()
  @Matches(UserDefinitions.REGEX.DATE_STRING, {
    message: UserErrors.DATE_OF_BIRTH,
  })
  dateOfBirth: string;

  @IsObject()
  profilePicture: fileInterface.I_File;
  @IsObject()
  coverPicture: fileInterface.I_File;
  @IsObject()
  resume: fileInterface.I_File;

  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(UserDefinitions.LIMITS.skills.MAX_ITEMS)
  skills: string[];

  @IsObject()
  socialLinks: userSocialInterface.I_UserSocial;

  @IsEnum(UserStatusEnum)
  userStatus: UserStatusEnum;
}

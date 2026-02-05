import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Types } from 'mongoose';
import { GenderEnum } from 'src/Common/Enums/gender.enum';
import { UserStatusEnum } from '../Enums/user.status.enum';
import { GeneralRegex, GeneralRegexMessage } from './user.regex';

export class GeneralFieldsDto {
  @IsMongoId()
  _id: Types.ObjectId;

  @Matches(GeneralRegex.FULL_NAME, {
    message:
      GeneralRegexMessage.FULL_NAME
  })
  @MaxLength(61)
  @MinLength(5)
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @Matches(GeneralRegex.PHONE_NUMBER, {
    message: GeneralRegexMessage.PHONE_NUMBER,
  })
  phoneNumber: string;

  @Matches(
    GeneralRegex.PASSWORD,
    {
      message: GeneralRegexMessage.PASSWORD
    },
  )
  password: string;

  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @Matches(GeneralRegex.DATE_OF_BIRTH, {
    message: GeneralRegexMessage.DATE_OF_BIRTH
  })
  dateOfBirth: string;

  @IsEnum(UserStatusEnum)
  userStatus: UserStatusEnum;


  @Length(6, 6, { message: 'OTP code must be exactly 6 characters or digits' })
  @IsString()
  otpCode: string;



}

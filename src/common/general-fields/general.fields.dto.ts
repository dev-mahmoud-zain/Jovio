import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
} from 'class-validator';
import { Types } from 'mongoose';
import { GenderEnum, UserStatusEnum } from '../enums';
import { Transform } from 'class-transformer';

export class GeneralFields {
  @IsMongoId()
  _id: Types.ObjectId;

  @Matches(/^[A-Za-z][a-z]* [A-Za-z][a-z]*$/, {
    message:
      'Please enter your full name with first and last name, each starting with a letter followed by lowercase letters (e.g., Mahmoud Zain).',
  })
  @IsString()
  userName: string;

  @IsEmail(
    {},
    {
      message:
        'Please enter a valid email address (e.g., adhamzain@example.com).',
    },
  )
  email: string;

  @IsStrongPassword()
  @IsString()
  password: string;

  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @Matches(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])$/, {
    message:
      'Please enter your date of birth in YYYY-MM-D format (e.g., 2023-12-4).',
  })
  @IsString()
  dateOfBirth: string;

  @Matches(/^\+20(10|11|12|15)\d{8}$/, {
    message:
      'Please enter a valid Egyptian phone number starting with +20 followed by a valid network code (010, 011, 012, or 015) — e.g., +201120809106.',
  })
  @IsString()
  phone: string;

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value
        .toLowerCase()
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    }
    return value;
  })
  @IsEnum(UserStatusEnum)
  status: UserStatusEnum;



  @Length(6)
  @IsString()
  OTP_Code:string
}

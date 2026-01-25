import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Types } from 'mongoose';
import { GenderEnum } from 'src/Common/Enums/gender.enum';
import { UserStatusEnum } from '../Enums/user.status.enum';

export class GeneralFieldsDto {
  @IsMongoId()
  _id: Types.ObjectId;

  @Matches(/^[A-Z][a-z]+ [A-Z][a-z]+$/, {
    message:
      'Full name must contain first and last name, starting with uppercase letters.',
  })
  @MaxLength(61)
  @MinLength(5)
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @Matches(/^\+20(10|11|12|15)\d{8}$/, {
    message:
      'Phone number must be a valid Egyptian phone number starting with +2010, +2011, +2012, or +2015 followed by 8 digits.',
  })
  phoneNumber: string;

  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d@$!%*?&#]{8,}$/,
    {
      message:
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&).',
    },
  )
  password: string;

  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @Matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/, {
    message:
      'Please enter your date of birth in DD/MM/YYYY format (e.g., 01/07/2000).',
  })
  dateOfBirth: string;

  @IsEnum(UserStatusEnum)
  userStatus: UserStatusEnum;
}

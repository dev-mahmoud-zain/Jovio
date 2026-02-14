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

export class GeneralFieldsDto {
  @IsMongoId()
  _id: Types.ObjectId;

  @Length(6)
  @IsString()
  otpCode: string;
}

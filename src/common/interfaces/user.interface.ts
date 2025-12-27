import { Types } from 'mongoose';
import {
  GenderEnum,
  OTP_TypeEnum,
  ProviderEnum,
  RoleEnum,
  UserStatusEnum,
} from 'src/common/enums';
import { IImage } from './image.interface';
import { UserDocument } from 'src/DATABASE';

export interface IUser {
  _id?: Types.ObjectId;

  firstName: string;
  lastName: string;
  userName?: string;

  email: string;
  emailConfirmedAt?: Date;

  newEmail?: string;

  password?: string;
  provider: ProviderEnum;

  gender: GenderEnum;

  dateOfBirth: string;

  phone: string;

  role: RoleEnum;

  status?: UserStatusEnum;


  updatedBy?: Types.ObjectId | UserDocument;

  changeCredentialsTime?: Date;

  profilePicture?: IImage;
  profilePictures?: IImage[];

  coverPicture?: IImage;
  coverPictures?: IImage[];

  

  OTP_Code?: {
    code: string;
    type: OTP_TypeEnum;
    expiresAt: Date;
  };

  OTP_Count?: number;
  OTP_Block_ExpiresAt?: Date;

  _plainOTP?: string;

  createdAt?: Date;
  updatedAt?: Date;


  freezedAt?:Date;
  freezedBy? :Types.ObjectId

  restoredAt?:Date;
  restoredBy?:Types.ObjectId;
}

export type IUserResponse = Omit<IUser, 'profilePicture'> & {
  profilePicture: string | null;
};

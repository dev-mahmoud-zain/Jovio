import { Types } from 'mongoose';
import { CompanyStatus, EmployeesRange } from '../enums/company.enum';
import { IImage } from './image.interface';
import { UserDocument } from 'src/DATABASE';
import { OTP_TypeEnum } from '../enums';

export interface ICompany {
  _id: Types.ObjectId;
  companyName: string;
  description: string;
  industry: string;
  address: string;
  phone?: string;
  employsRange: EmployeesRange;
  companyEmail: string;
  createdBy: Types.ObjectId | UserDocument;

  status:CompanyStatus

  logo?: IImage;
  cover?: IImage;
  logos?: IImage[];
  covers?: IImage[];
  createdAt?: Date;
  updatedAt?: Date;

  OTP_Code?: {
    code: string;
    type: OTP_TypeEnum;
    expiresAt: Date;
  };
  OTP_Count?: number;
  OTP_Block_ExpiresAt?: Date;

  _plainOTP?: string;

  freezedAt?: Date;
  freezedBy?: Types.ObjectId;

  restoredAt?: Date;
  restoredBy?: Types.ObjectId;

  bannedAt?: Date;
  unBannedAt?: Date;
}
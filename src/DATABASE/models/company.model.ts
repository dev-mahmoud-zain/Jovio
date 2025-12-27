import { BadRequestException } from '@nestjs/common';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  emailEvent,
  encrypt,
  generateHash,
  generateOTP,
} from 'src/common/utils';
import type { IImage } from 'src/common/interfaces/image.interface';
import { EmailEventsEnum, OTP_TypeEnum } from 'src/common/enums';
import { ICompany } from 'src/common';
import { CompanyStatus, EmployeesRange } from 'src/common/enums/company.enum';
import { UserDocument } from './user.model';

// ================= Company Schema =================
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
@Schema()
export class Company implements ICompany {
  _id: Types.ObjectId;

  @Prop({ type: String, required: true, unique: true })
  companyName: string;

  @Prop({ type: String, minLength: 5, maxLength: 5000 })
  description: string;

  @Prop({ type: String })
  industry: string;

  @Prop({ type: String })
  address: string;

  @Prop({ type: String })
  phone?: string;

  @Prop({ type: String, enum: EmployeesRange, required: true })
  employsRange: EmployeesRange;

  @Prop({ type: String, required: true, unique: true })
  companyEmail: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId | UserDocument;

  @Prop({ type: String, enum: CompanyStatus, required: true })
  status: CompanyStatus;

  @Prop({ type: Object })
  logo?: IImage;

  @Prop({ type: Object })
  cover: IImage;

  @Prop({ type: [Object], _id: false })
  logos?: IImage[];

  @Prop({ type: [Object], _id: false })
  covers: IImage[];

  @Prop({ type: Object })
  OTP_Code?: {
    code: string;
    type: OTP_TypeEnum;
    expiresAt: Date;
  };

  @Prop({ type: Number })
  OTP_Count?: number;

  @Prop({ type: Date })
  OTP_Block_ExpiresAt?: Date;

  @Prop({ type: String })
  _plainOTP?: string;

  @Prop({ type: Date })
  createdAt?: Date;

  @Prop({ type: Date })
  updatedAt?: Date;

  @Prop({ type: Date })
  freezedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'Company' })
  freezedBy?: Types.ObjectId;

  @Prop({ type: Date })
  restoredAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'Company' })
  restoredBy?: Types.ObjectId;

  @Prop({ type: Date })
  bannedAt?: Date;

  @Prop({ type: Date })
  unBannedAt?: Date;
}

export const CompanySchema = SchemaFactory.createForClass(Company);

// ================= pre-save hook =================

interface HCompanyDocumentExtended extends HydratedDocument<Company> {
  _Plain_OTP?: string;
}

CompanySchema.pre(
  'save',
  async function (this: HCompanyDocumentExtended, next) {
    
    // encrypt phone if modified

    if (this.isModified('phone') && this.phone) {
      this.phone = encrypt(this.phone);
    }

    // encrypt email if modified

    if (this.isModified('companyEmail') && this.companyEmail) {
      this._Plain_OTP = generateOTP();
      this.OTP_Code = {
        code: await generateHash(this._Plain_OTP),
        type: OTP_TypeEnum.confirm_Company_Email,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      };
    }

    next();
  },
);

CompanySchema.post(
  'save',
  async function (this: HCompanyDocumentExtended, next) {
    if (this._Plain_OTP) {
      try {
        emailEvent.emit(EmailEventsEnum.confirm_Company_Email, {
          to: this.companyEmail,
          OTP_Code: this._Plain_OTP,
          companyName: this.companyName,
        });
      } catch (error) {
        throw new BadRequestException('Fail to send email');
      }
    }
  },
);

//================= Export Model =================
export type CompanyDocument = HydratedDocument<Company>;

export const CompanyModel = MongooseModule.forFeature([
  { name: Company.name, schema: CompanySchema },
]);

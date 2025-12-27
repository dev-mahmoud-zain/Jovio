import {
  BadRequestException,
} from '@nestjs/common';
import {
  MongooseModule,
  Prop,
  Schema,
  SchemaFactory,
  Virtual,
} from '@nestjs/mongoose';
import { HydratedDocument, Types, UpdateQuery } from 'mongoose';
import { IUser } from 'src/common';
import {
  decrypt,
  emailEvent,
  encrypt,
  generateHash,
  generateOTP,
} from 'src/common/utils';
import type { IImage } from 'src/common/interfaces/image.interface';
import {
  EmailEventsEnum,
  GenderEnum,
  OTP_TypeEnum,
  ProviderEnum,
  RoleEnum,
  UserStatusEnum,
} from 'src/common/enums';

// ================= Nested OTP Schema =================
@Schema({ _id: false })
export class OTP_Schema {
  @Prop({ type: String, required: true })
  code: string;

  @Prop({ type: String, enum: Object.values(OTP_TypeEnum), required: true })
  type: OTP_TypeEnum;

  @Prop({ type: Date, required: true })
  expiresAt: Date;
}

export const OTPSchema = SchemaFactory.createForClass(OTP_Schema);

// ================= User Schema =================
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User implements IUser {
  @Prop({ type: String, min: 2, max: 30, required: true })
  firstName: string;

  @Prop({ type: String, min: 2, max: 30, required: true })
  lastName: string;

  @Virtual({
    get: function (this: User) {
      return `${this.firstName} ${this.lastName}`;
    },
    set: function (value: string) {
      const [firstName, lastName] = value.split(' ');
      this.set({ firstName, lastName });
    },
  })
  userName: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: Date })
  emailConfirmedAt?: Date;

  @Prop({ type: String, required: false, unique: true, sparse: true  })
  newEmail?: string;
  @Prop({ type: String, enum: ProviderEnum, default: ProviderEnum.system })
  provider: ProviderEnum;

  @Prop({ type: String, enum: RoleEnum, default: RoleEnum.user })
  role: RoleEnum;

  @Prop({ type: String, enum: UserStatusEnum })
  status?: UserStatusEnum;

  @Prop({
    type: String,
    required: function (this: User) {
      return this.provider === ProviderEnum.system;
    },
  })
  password: string;

  @Prop({ type: String, enum: GenderEnum, default: GenderEnum.male })
  gender: GenderEnum;

  @Prop({ type: String })
  phone: string;

  @Prop({ type: Date })
  changeCredentialsTime?: Date;

  @Prop({
    type: { url: String, public_id: String },
    _id: false,
  })
  profilePicture: IImage;

  @Prop([
    {
      type: { url: String, public_id: String },
      _id: false,
    },
  ])
  profilePictures?: IImage[];

  @Prop({
    type: { url: String, public_id: String },
    _id: false,
  })
  coverPicture?: IImage;

  @Prop([
    {
      type: { url: String, public_id: String },
      _id: false,
    },
  ])
  coverPictures?: IImage[];

  @Prop({ type: OTP_Schema })
  OTP_Code?: OTP_Schema;

  @Prop({ type: Number })
  OTP_Count?: number;

  @Prop({ type: Date })
  OTP_Block_ExpiresAt?: Date;

  @Prop({ type: String })
  dateOfBirth: string;

  @Prop({ type: Date })
  bannedAt?: Date;

  @Prop({ type: Date })
  deletedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy?: Types.ObjectId;

  @Prop({ type: Date })
  createdAt?: Date;

  @Prop({ type: Date })
  updatedAt?: Date;

  @Prop({ type: Date })
  freezedAt?: Date;
  @Prop({ type: Types.ObjectId, ref: 'User' })
  freezedBy?: Types.ObjectId;

  @Prop({ type: Date })
  restoredAt?: Date;
  @Prop({ type: Types.ObjectId, ref: 'User' })
  restoredBy?: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);

// ================= pre-save hook =================

interface HUserDocumentExtended extends HydratedDocument<User> {
  _Plain_OTP?: string;
}

UserSchema.pre('save', async function (this: HUserDocumentExtended, next) {
  // hash password if modified
  if (this.isModified('password') && this.password) {
    this.password = await generateHash(this.password);
  }

  // encrypt phone if modified
  if (this.isModified('phone') && this.phone) {
    this.phone = encrypt(this.phone);
  }

  if (this.provider !== ProviderEnum.system) {
    next();
  }

  if (this.isModified('email') && this.email) {
    this._Plain_OTP = generateOTP();
    this.OTP_Code = {
      code: await generateHash(this._Plain_OTP),
      type: OTP_TypeEnum.confirm_Email,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    };
  }

  next();
});

UserSchema.post('save', async function (this: HUserDocumentExtended, next) {
  if (this._Plain_OTP) {
    try {
      emailEvent.emit(EmailEventsEnum.confirm_Email, {
        to: this.email,
        OTP_Code: this._Plain_OTP,
      });
    } catch (error) {
      throw new BadRequestException('Fail to send email');
    }
  }
});

// ================= pre-update hook =================

UserSchema.pre(['updateOne', 'findOneAndUpdate'], async function (next) {
  const update = this.getUpdate() as UpdateQuery<any>;
  if (!update) return next();

  const setData = update.$set || update;

  if (setData.password) {
    setData.password = await generateHash(setData.password);
  }

  if (setData.OTP_Code && setData.OTP_Code.type !== OTP_TypeEnum.update_Email) {
    const _Plain_OTP = generateOTP();

    setData.OTP_Code = {
      code: await generateHash(_Plain_OTP),
      type: setData.OTP_Code.type,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    };

    const filter = this.getQuery();
    const userEmail = filter?.email;

    emailEvent.emit(setData.OTP_Code.type, {
      to: userEmail,
      OTP_Code: _Plain_OTP,
    });
  }

  if (setData.freezedBy) {
    setData.freezedAt = new Date();
  }

  if (setData.restoredBy) {
    setData.restoredAt = new Date();
  }

  next();
});

//================= Export Model =================
export type UserDocument = HydratedDocument<User>;

export const UserModel = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
]);

UserSchema.post('init', function (doc: UserDocument) {
  if (doc.phone) {
    doc.phone = decrypt(doc.phone);
  }
});

export const connectedSockets = new Map<string, string[]>();

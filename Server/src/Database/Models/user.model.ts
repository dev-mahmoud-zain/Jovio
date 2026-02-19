import { Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { GenderEnum } from 'src/Common/Enums/gender.enum';
import { ProviderEnum } from 'src/Common/Enums/provider.enum';
import { RoleEnum } from 'src/Common/Enums/role.enum';
import { UserStatusEnum } from 'src/Common/Enums/user.status.enum';
import type { I_File } from 'src/Common/Interfaces/file.interface';
import { I_UserGallery } from 'src/Common/Interfaces/gallery.interface';
import { I_User } from 'src/Common/Interfaces/user.interface';
import type { I_UserSocial } from 'src/Common/Interfaces/user.social.interface';
import { UserDefinitions } from 'src/Modules/Users/Definitions/user.definitions';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  strictQuery: true,
})
export class User implements I_User {
  @Prop({
    type: String,
    required: true,
    minlength: UserDefinitions.LIMITS.firstName.MIN,
    maxlength: UserDefinitions.LIMITS.firstName.MAX,
  })
  firstName: string;

  @Prop({
    type: String,
    required: true,
    minlength: UserDefinitions.LIMITS.lastName.MIN,
    maxlength: UserDefinitions.LIMITS.lastName.MAX,
  })
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
  fullName: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: UserDefinitions.REGEX.EMAIL,
  })
  email: string;

  @Prop({
    type: Date,
    required: false,
  })
  emailConfirmedAt?: Date;

  @Prop({
    type: String,
    required: false,
    lowercase: true,
    match: UserDefinitions.REGEX.EMAIL,
  })
  newEmail?: string;
    @Prop({
        type: Date,
        required: false
    })
    accountVerifyedAt?: Date;

  @Prop({
    type: String,
    required: false,
    match: UserDefinitions.REGEX.PHONE_NUMBER,
  })
  phoneNumber?: string;

  @Prop({
    type: String,
    required: true,
    enum: ProviderEnum,
    default: ProviderEnum.SYSTEM,
  })
  provider: ProviderEnum;

  @Prop({
    type: String,
    required: true,
    enum: RoleEnum,
    default: RoleEnum.USER,
  })
  role: RoleEnum;

  @Prop({
    type: String,
    required: false,
    enum: UserStatusEnum,
  })
  status?: UserStatusEnum;

  @Prop({
    type: String,
    required: false,
    maxlength: UserDefinitions.LIMITS.bio.MAX,
  })
  bio?: string;

  @Prop({
    type: Object,
    required: false,
  })
  socialLinks?: I_UserSocial;

  @Prop({
    type: String,
    required: function (this: User) {
      return this.provider === ProviderEnum.SYSTEM;
    },
  })
  password: string;

  @Prop({
    type: String,
    required: function (this: User) {
      return this.provider === ProviderEnum.SYSTEM;
    },
    enum: GenderEnum,
  })
  gender: GenderEnum;

  @Prop({
    type: String,
    required: function (this: User) {
      return this.provider === ProviderEnum.SYSTEM;
    },
    match: UserDefinitions.REGEX.DATE_STRING,
  })
  dateOfBirth: string;

  @Prop({
    type: Date,
    required: false,
  })
  changeCredentialsTime?: Date;

  @Prop({ type: Object, required: false })
  profilePicture?: I_File;

  @Prop({ type: Object, required: false })
  coverPicture?: I_File;

  @Prop({
    type: [Object],
    required: false,
    default: [],
  })
  gallery?: I_UserGallery[];

  @Prop({ type: Object, required: false })
  resume?: I_File;

  @Prop({
    type: [String],
    required: false,
    default: [],
    validate: [
      (val: string[]) => val.length <= UserDefinitions.LIMITS.skills.MAX_ITEMS,
      `{PATH} exceeds the limit of ${UserDefinitions.LIMITS.skills.MAX_ITEMS} items`,
    ],
  })
  skills?: string[];

  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  isDeleted: boolean;

  @Prop({ type: Date, required: false })
  bannedAt?: Date;

  @Prop({ type: Date, required: false })
  bannedUntil?: Date;

  @Prop({
    type: String,
    required: false,
    maxlength: UserDefinitions.LIMITS.reason.MAX,
  })
  bannedReason?: string;

  @Prop({ type: Types.ObjectId, required: false, ref: 'User' })
  bannedBy?: Types.ObjectId;

  @Prop({ type: Date, required: false })
  freezedAt?: Date;

  @Prop({ type: Date, required: false })
  freezedUntil?: Date;

  @Prop({
    type: String,
    required: false,
    maxlength: UserDefinitions.LIMITS.reason.MAX,
  })
  freezedReason?: string;

  @Prop({ type: Types.ObjectId, required: false, ref: 'User' })
  freezedBy?: Types.ObjectId;

  @Prop({ type: Date, required: false })
  restoredAt?: Date;

  @Prop({ type: Types.ObjectId, required: false, ref: 'User' })
  restoredBy?: Types.ObjectId;
}

export type H_UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);

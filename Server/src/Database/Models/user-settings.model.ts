import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ProfileVisibility } from 'src/Common/Enums/user-settings.enum';
import { I_ActiveSession, I_UserSettings } from 'src/Common/Interfaces/user-settings.interface';

@Schema({ timestamps: true })
export class UserSettings implements I_UserSettings {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ default: false })
  is2FAEnabled: boolean;

  @Prop({ type: [String], default: [] })
  backupCodes: string[]; // Remember to encrypt these before saving!

  @Prop([
    {
      device: String,
      ipAddress: String,
      lastActiveAt: { type: Date, default: Date.now },
    },
  ])
  activeSessions: I_ActiveSession[];

  @Prop({ default: true })
  notifyOnNewDeviceLogin: boolean;

  @Prop({ type: Date, default: null })
  loginBlockedUntil: Date;

  @Prop({
    type: String,
    enum: ProfileVisibility,
    default: ProfileVisibility.PUBLIC,
  })
  profileVisibility: ProfileVisibility;

  @Prop({ default: false })
  hideEmail: boolean;

  @Prop({ default: false })
  hidePhone: boolean;

  @Prop({ default: true })
  emailNotifications: boolean;
}

export const UserSettingsSchema = SchemaFactory.createForClass(UserSettings);

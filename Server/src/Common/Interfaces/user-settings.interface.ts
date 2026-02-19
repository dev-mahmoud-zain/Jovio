import { Types } from 'mongoose';
import { ProfileVisibility } from '../Enums/user-settings.enum';

export interface I_ActiveSession {
  device: string;
  ipAddress: string;
  lastActiveAt: Date;
}

export interface I_UserSettings {
  _id?: string | Types.ObjectId;
  userId: string | Types.ObjectId;
  is2FAEnabled: boolean;
  backupCodes: string[];
  activeSessions: I_ActiveSession[];
  notifyOnNewDeviceLogin: boolean;
  loginBlockedUntil: Date | null;
  profileVisibility: ProfileVisibility;
  hideEmail: boolean;
  hidePhone: boolean;
  emailNotifications: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

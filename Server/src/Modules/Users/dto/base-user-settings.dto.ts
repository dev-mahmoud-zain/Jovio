import {
  IsBoolean,
  IsString,
  IsArray,
  IsDate,
  IsEnum,
  IsOptional,
  IsMongoId,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { ProfileVisibility } from 'src/Common/Enums/user-settings.enum';

class ActiveSessionDto {
  @IsString()
  device: string;

  @IsString()
  ipAddress: string;

  @IsDate()
  @Type(() => Date)
  lastActiveAt: Date;
}

export class BaseUserSettingsDto {
  @IsMongoId()
  userId: Types.ObjectId;

  @IsBoolean()
  is2FAEnabled: boolean;

  @IsArray()
  @IsString({ each: true })
  backupCodes: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActiveSessionDto)
  activeSessions: ActiveSessionDto[];

  @IsBoolean()
  notifyOnNewDeviceLogin: boolean;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  loginBlockedUntil: Date;

  @IsEnum(ProfileVisibility)
  profileVisibility: ProfileVisibility;

  @IsBoolean()
  hideEmail: boolean;

  @IsBoolean()
  hidePhone: boolean;

  @IsBoolean()
  emailNotifications: boolean;
}

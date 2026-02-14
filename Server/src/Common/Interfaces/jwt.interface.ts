import { Types } from "mongoose";
import { TokenTypeEnum } from "../Types/token.types";

export enum DeviceTypeEnum {
    DESKTOP = "Desktop",
    MOBILE = "Mobile",
    TABLET = "Tablet"
}

export enum OSEnum {
    LINUX = "Linux",
    WINDOWS = "Windows",
    MAC_OS = "Mac Os",
    ANDROID = "Android",
    IOS = "Ios"
}

export enum BrowserEnum {
    CHROME = "Chrome",
    FIREFOX = "Firefox",
    SAFARI = "Safari",
    EDGE = "Edge"
}

export interface I_DeviceInfo {
    type: DeviceTypeEnum;
    os: OSEnum;
    browser: BrowserEnum
}

export interface I_Jwt {
    _id?: Types.ObjectId;

    userId: Types.ObjectId;

    jti: string;

    token: string;

    type: TokenTypeEnum;

    expiresAt: Date;

    revoked: boolean;

    revokedAt?: Date;

    deviceInfo: I_DeviceInfo;

    ipAddress: string;

    userAgent: string;

    createdAt?: Date;
    updatedAt?: Date;
}
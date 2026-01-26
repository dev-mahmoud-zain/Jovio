import { Types } from "mongoose";
import { OtpTypeEnum } from "../Types/otp.types";

export interface I_Otp {
    _id?:Types.ObjectId;

    userId:Types.ObjectId;

    otp :string;

    type:OtpTypeEnum;

    expiresAt:Date;

    isUsed:Boolean;

    usedAt?:Date;

    attempts:number;

    blockedUntil:Date;

    createdAt?:Date;
    updatedAt?:Date;

}
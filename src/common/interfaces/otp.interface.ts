import { OTP_TypeEnum } from "../enums";

export interface I_OTP {
    code: string,
    expiresAt: Date,
    type: OTP_TypeEnum,
}
import { Types } from "mongoose";
import { RoleEnum } from "../Enums/role.enum";

export enum SignatureLevelEnum {
  BEARER = 'Bearer',
  SYSTEM = 'System',
}

export enum TokenTypeEnum {
  ACCESS = 'Access',
  REFRESH = 'Refresh',
}

export interface I_SignToken {
  payload: {
    userId: Types.ObjectId | string;
    userRole: RoleEnum;
  };
  tokenType: TokenTypeEnum;
  signature: SignatureLevelEnum;
}

export interface I_Decoded {
  userId: Types.ObjectId;
  userRole: RoleEnum;
  iat: number;
  exp: number;
  jti: string;
}
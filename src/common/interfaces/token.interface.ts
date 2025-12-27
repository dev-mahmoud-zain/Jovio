import { Types } from "mongoose";

export interface IToken {
    _id?: Types.ObjectId,

    jti: string,
    expiresAt: Date,
    createdBy: Types.ObjectId,

    createdAt?: Date,
    updatedAt?: Date,
}
import { JwtSignOptions, JwtVerifyOptions } from "@nestjs/jwt"
import {  Types } from "mongoose"

export interface IGenerateToken {
    payload: {
        _id: Types.ObjectId,
        role: string
    },
    options?: JwtSignOptions

}


export interface IVerifyToken {
    token: string
    options?: JwtVerifyOptions
}


export enum SignatureLevelEnum {
    Bearer = "Bearer",
    System = "System"
}


export enum TokenTypeEnum {
    access = "access",
    refresh = "refresh"
}

export enum LogoutFlagEnum {
    current = "current",
    all = "all"
}
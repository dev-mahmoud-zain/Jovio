
import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import { RoleEnum } from "src/Common/Enums/role.enum";
import { sign } from "jsonwebtoken"
import { Response } from "express";


export enum SignatureLevelEnum {
    BEARER = "Bearer",
    SYSTEM = "System",
}

export enum TokenTypeEnum {
    ACCESS = "Access",
    REFRESH = "Refresh",
}


interface I_SignToken {
    payload: {
        userId: Types.ObjectId | string,
        userRole: RoleEnum,
    }
    tokenType: TokenTypeEnum
}

@Injectable()
export class TokenService {
    constructor() {

    }

    private getSecretKey(userRole: RoleEnum, tokenType: TokenTypeEnum): string {
        const isUser = userRole === RoleEnum.USER;
        let key: string | undefined;

        if (isUser) {
            key = tokenType === TokenTypeEnum.ACCESS
                ? process.env.ACCESS_USER_TOKEN_SIGNATURE
                : process.env.REFRESH_USER_TOKEN_SIGNATURE;
        } else {
            key = tokenType === TokenTypeEnum.ACCESS
                ? process.env.ACCESS_SYSTEM_TOKEN_SIGNATURE
                : process.env.REFRESH_SYSTEM_TOKEN_SIGNATURE;
        }

        if (!key) {
            throw new Error(`Secret key for ${tokenType} ${userRole} is missing in .env`);
        }

        return key;
    }

    private async signToken(data: I_SignToken) {

        let SECRET_KEY: string = this.getSecretKey(data.payload.userRole, data.tokenType);

        const expiresIn = data.tokenType === TokenTypeEnum.ACCESS ? "1h" : "7d"

        return sign(data.payload, SECRET_KEY, {
            expiresIn,
            jwtid: crypto.randomUUID()
        })


    }

    async createLoginCredentials(userId: Types.ObjectId | string,
        userRole: RoleEnum) {

        const signature = userRole === RoleEnum.USER ? SignatureLevelEnum.BEARER : SignatureLevelEnum.SYSTEM

        const access_token = `${signature} ${await this.signToken({
            payload: {
                userId,
                userRole
            },
            tokenType: TokenTypeEnum.ACCESS
        })}`;


        const refresh_token = `${signature} ${await this.signToken({
            payload: {
                userId,
                userRole
            },
            tokenType: TokenTypeEnum.REFRESH
        })}`

        return {
            access_token,
            refresh_token
        }

    }

    setTokenToCookies(res: Response, token: string, type: TokenTypeEnum) {

        const isAccess = type === TokenTypeEnum.ACCESS;

        const name = isAccess ? "access_token" : "refresh_token";

        const maxAge = isAccess
            ? 1 * 60 * 60 * 1000
            : 7 * 24 * 60 * 60 * 1000;

        res.cookie(name, token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge,
            path: isAccess ? "/" : "/api/auth/refresh-token"
        })


    }


}
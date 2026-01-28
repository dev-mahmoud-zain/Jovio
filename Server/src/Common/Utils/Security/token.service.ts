import { JwtRepository } from 'src/Database/Repository/jwt.repository';

import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import { RoleEnum } from "src/Common/Enums/role.enum";
import { sign } from "jsonwebtoken"
import { DeviceInfo } from 'src/Database/Models/jwt.model';
import { generateHash } from './hash';


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
    constructor(
        private readonly jwtRepository:JwtRepository
    ) {
        
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

        const jti = crypto.randomUUID();

        return {
            token: sign(data.payload, SECRET_KEY, {
                expiresIn,
                jwtid: jti
            }),
            jti
        }


    }

    async createLoginCredentials(userId: Types.ObjectId | string,
        userRole: RoleEnum) {

        const signature = userRole === RoleEnum.USER ? SignatureLevelEnum.BEARER : SignatureLevelEnum.SYSTEM

        const access_token = await this.signToken({
            payload: {
                userId,
                userRole
            },
            tokenType: TokenTypeEnum.ACCESS
        });

        const refresh_token = await this.signToken({
            payload: {
                userId,
                userRole
            },
            tokenType: TokenTypeEnum.REFRESH
        })


        return {
            access_token: {
                token: `${signature} ${access_token.token}`,
                jti: access_token.jti
            },
            refresh_token: {
                token: `${signature} ${refresh_token.token}`,
                jti: refresh_token.jti
            }
        }

    }

    async saveJwt(userId: Types.ObjectId,
        jti: string,
        token: string,
        type: TokenTypeEnum,
        session: {
            deviceInfo: DeviceInfo,
            ipAddress: string,
            userAgent: string
        }) {

            const expiresAt = type === TokenTypeEnum.ACCESS ? new Date(Date.now() + 60 * 60 * 1000) :new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            
            this.jwtRepository.create({
                data:[{
                    userId,
                    token: await generateHash({text:token}),
                    type,
                    jti,
                    ipAddress:session.ipAddress,
                    deviceInfo:session.deviceInfo,
                    userAgent:session.userAgent,
                    expiresAt
                }]
            })

            
    }


}
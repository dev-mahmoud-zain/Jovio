import { Response } from "express";
import { TokenTypeEnum } from "../Security/token.service";

export class CookiesService {
    constructor(){}


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
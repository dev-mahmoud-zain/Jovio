import { applyDecorators, UseGuards } from "@nestjs/common";
import { RoleEnum } from "../enums";
import { TokenTypeEnum } from "../enums/token.enums";
import { SetAccessRoles } from "./roles.decorator";
import { SetTokenType } from "./token.decorator";
import { AuthenticationGuard } from "../authentication";
import { AuthorizationGuard } from "../authorization";

export function Auth(
    accessRoles: RoleEnum[] = [],
    tokenType: TokenTypeEnum = TokenTypeEnum.access
) {

    return applyDecorators(
        SetAccessRoles(accessRoles),
        SetTokenType(tokenType),
        UseGuards(AuthenticationGuard,AuthorizationGuard)
    )

}
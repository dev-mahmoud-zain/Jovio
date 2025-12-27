import { SetMetadata } from "@nestjs/common"
import { TokenTypeEnum } from "../enums/token.enums"

export const SetTokenType = (tokenType: TokenTypeEnum = TokenTypeEnum.access) => {
    return SetMetadata("tokenType", tokenType);
}
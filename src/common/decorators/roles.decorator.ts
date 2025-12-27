import { SetMetadata } from "@nestjs/common"
import { RoleEnum } from "../enums";

export const SetAccessRoles = (accessRoles: RoleEnum[] = []) => {
    return SetMetadata("accessRoles", accessRoles);
}
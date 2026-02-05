import { Types } from "mongoose";
import { GenderEnum } from "../Enums/gender.enum";
import { ProviderEnum } from "../Enums/provider.enum";
import { RoleEnum } from "../Enums/role.enum";
import { UserStatusEnum } from "../Enums/user.status.enum";
import { I_File } from "./file.interface";
import { I_UserSocial } from "./user.social.interface";
import { I_UserGallery } from "./gallery.interface";

export interface I_User {
    _id?: Types.ObjectId;

    firstName: string;
    lastName: string;

    fullName: string;

    email: string;
    accountVerifyedAt?: Date;
    newEmail?: string;

    phoneNumber?: string;

    provider: ProviderEnum;

    role: RoleEnum;

    status?: UserStatusEnum;

    bio?: string;

/*     jobTitle?: string; // Need To Add To SRS File

    companyName?: string; // Need To Add To SRS File

    location?: string; //  Need To Add To SRS File */

    socialLinks?: I_UserSocial;

    password: string;

    gender: GenderEnum;

    dateOfBirth: string;

    changeCredentialsTime?: Date;

    profilePicture?: I_File;
    coverPicture?: I_File;
    gallery?: I_UserGallery[];

    resume?: I_File;

    skills?: string[];

    bannedAt?: Date;
    bannedUntil?: Date;
    bannedReason?: string;
    bannedBy?: Types.ObjectId;

    freezedAt?: Date;
    freezedUntil?: Date;
    freezedReason?: string;
    freezedBy?: Types.ObjectId;

    restoredAt?: Date;
    restoredBy?: Types.ObjectId;

    createdAt?: Date;
    updatedAt?: Date;
}
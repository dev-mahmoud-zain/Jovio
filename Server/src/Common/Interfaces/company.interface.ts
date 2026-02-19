import { Types } from "mongoose";
import { I_Location } from "./location.interface";
import { I_User } from "./user.interface";
import { I_File } from "./file.interface";
import { I_CompanyGallery } from "./gallery.interface";
import { I_SocialLinks } from "./social.interface";


export enum CompanyVerificationStatusEnum {
    PENDING = "Pending",
    APPROVED = "Approved",
    REJECTED = "Rejected",
}

export enum CompanyStatus {
    ACTIVE = "Active",
    SUSPENDED = "Suspended",
    PANNED = "Panned"
}


export interface I_Company {

    _id?: Types.ObjectId;

    owner: Types.ObjectId | Partial<I_User>;

    admins?: Types.ObjectId[] | Partial<I_User>[]

    name: string;

    slug: string;

    email: string;

    phone?: string;

    website?: string;

    description: string;

    industry: string;

    size: string;

    foundedAt: string;

    location: I_Location;

    verificationStatus: CompanyVerificationStatusEnum;

    isVerified: boolean;

    verifiedAt?: Date;

    logo?: I_File;

    coverImage?: I_File;

    gallery: I_CompanyGallery;

    socialLinks?: I_SocialLinks;

    status?: CompanyStatus;

    suspendedAt: Date;
    suspendedBy: Types.ObjectId;

    
    bannedAt?: Date;
    bannedUntil?: Date;
    bannedReason?: string;
    bannedBy?: Types.ObjectId;
    unPannedAt?: Date;
    unPannedBy?: Types.ObjectId;


    freezedAt?: Date;
    freezedUntil?: Date;
    freezedReason?: string;
    freezedBy?: Types.ObjectId;

    restoredAt?: Date;
    restoredBy?: Types.ObjectId;

    createdAt?: Date;
    updatedAt?: Date;
}
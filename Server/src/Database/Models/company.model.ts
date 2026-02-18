import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { CompanyStatus, CompanyVerificationStatusEnum, I_Company } from "src/Common/Interfaces/company.interface";
import type { I_File } from "src/Common/Interfaces/file.interface";
import type { I_CompanyGallery } from "src/Common/Interfaces/gallery.interface";
import type { I_Location } from "src/Common/Interfaces/location.interface";
import type { I_SocialLinks } from "src/Common/Interfaces/social.interface";
import { User } from "./user.model";
import slugify from "slugify";

@Schema({ _id: false })
export class Location {

    @Prop({ required: true })
    country: string;

    @Prop({ required: true })
    city: string;

    @Prop({ required: true })
    street: string;

    @Prop()
    building?: string;

    @Prop()
    postalCode?: string;

    @Prop()
    latitude?: number;

    @Prop()
    longitude?: number;
}

@Schema({
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strictQuery: true
})

export class Company implements I_Company {


    @Prop({
        type: Types.ObjectId,
        ref: "User",
        required: true
    })
    owner: Types.ObjectId | User;

    @Prop([{ type: Types.ObjectId, ref: "User" }])
    admins?: Types.ObjectId[];

    @Prop({
        required: true,
        unique: true
    })
    name: string;

    @Prop({
        type: String,
        unique: true,
        lowercase: true,
        index: true
    })
    slug: string;

    @Prop({
        type: String,
        unique: true,
        lowercase: true,
        index: true
    })
    email: string;

    @Prop({
        type: String,
        unique: true,
    })
    phone?: string;

    @Prop({
        type: String,
    })
    website?: string;

    @Prop({
        type: String,
    })
    description: string;

    @Prop({
        type: String,
    })
    industry: string;

    @Prop({
        type: String,
    })
    size: string;

    @Prop({
        type: String,
        required: true
    })
    foundedAt: string;

    @Prop({
        type: Location,
        required: true
    })
    location: I_Location;

    @Prop({
        type: String,
        enum: Object.values(CompanyVerificationStatusEnum),
        required: true,
        default: CompanyVerificationStatusEnum.PENDING
    })
    verificationStatus: CompanyVerificationStatusEnum;

    @Prop({
        type: Boolean,
        required: true,
        default: false
    })
    isVerified: boolean;

    @Prop({
        type: Date,
    })
    verifiedAt?: Date;

    @Prop({
        type: <I_File>{},
    })
    logo?: I_File;

    @Prop({
        type: <I_File>{},
    })
    coverImage?: I_File;

    @Prop({
        type: <I_CompanyGallery>{},
    })
    gallery: I_CompanyGallery;

    @Prop({
        type: <I_SocialLinks>{},
        required: false
    })
    socialLinks?: I_SocialLinks;

    @Prop({
        type: String,
        enum: Object.values(CompanyStatus),
    })
    status?: CompanyStatus;


    @Prop({
        type: Date,
        required: function (this: Company) {
            return this.status === CompanyStatus.SUSPENDED
        }
    })
    suspendedAt: Date;

    @Prop({
        type: Types.ObjectId,
        ref: "User",
        required: function (this: Company) {
            return this.suspendedAt;
        }
    })
    suspendedBy: Types.ObjectId;




    @Prop({
        type: Date,
        required: false
    })
    bannedAt?: Date;

    @Prop({
        type: Date,
        required: false
    })
    bannedUntil?: Date;

    @Prop({
        type: String,
        required: false
    })
    bannedReason?: string;

    @Prop({
        type: Types.ObjectId,
        ref: "User",
        required: false
    })
    bannedBy?: Types.ObjectId;

    @Prop({
        type: Date,
        required: false
    })
    unPannedAt?: Date;

    @Prop({
        type: Types.ObjectId,
        ref: "User",
        required: false
    })
    unPannedBy?: Types.ObjectId;

    @Prop({
        type: Date,
        required: false
    })
    freezedAt?: Date;

    @Prop({
        type: Date,
        required: false
    })
    freezedUntil?: Date;

    @Prop({
        type: String,
        required: false
    })
    freezedReason?: string;

    @Prop({
        type: Types.ObjectId,
        required: false
    })
    freezedBy?: Types.ObjectId;

    @Prop({
        type: Date,
        required: false
    })
    restoredAt?: Date;

    @Prop({
        type: Types.ObjectId,
        ref: "User",
        required: false
    })
    restoredBy?: Types.ObjectId;



}

export type H_CompanyDocument = HydratedDocument<Company>;

export const CompanySchema = SchemaFactory.createForClass(Company);

CompanySchema.pre("save", async function (next) {


    if (this.name) {

        const baseSlug = slugify(this.name, {
            lower: true,
            strict: true, 
            trim: true
        });

        let slug = baseSlug;
        let counter = 1;

        const CompanyModel = this.constructor as any;

        while (await CompanyModel.exists({ slug })) {
            slug = `${baseSlug}-${counter++}`;
        }

        this.slug = slug;
    }

    


});
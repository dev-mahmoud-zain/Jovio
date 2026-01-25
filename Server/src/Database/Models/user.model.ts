import { MongooseModule, Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { GenderEnum } from "src/Common/Enums/gender.enum";
import { ProviderEnum } from "src/Common/Enums/provider.enum";
import { RoleEnum } from "src/Common/Enums/role.enum";
import { UserStatusEnum } from "src/Common/Enums/user.status.enum";
import type { I_File } from "src/Common/Interfaces/file.interface";
import { I_UserGallery } from "src/Common/Interfaces/gallery.interface";
import { I_User } from "src/Common/Interfaces/user.interface";
import type { I_UserSocial } from "src/Common/Interfaces/user.social.interface";

@Schema({
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strictQuery: true
})
export class User implements I_User {

    @Prop({
        type: String,
        required: true,
        min: 2,
        max: 30
    })
    firstName: string;

    @Prop({
        type: String,
        required: true,
        min: 2,
        max: 30
    })
    lastName: string;

    @Virtual({
        get: function (this: User) {
            return `${this.firstName} ${this.lastName}`;
        },
        set: function (value: string) {
            const [firstName, lastName] = value.split(" ");
            this.set({ firstName, lastName });
        }
    })
    fullName: string

    @Prop({
        type: String,
        required: true,
        unique: true,
        lowercase: true
    })
    email: string;

    @Prop({
        type: Date,
        required: false
    })
    emailConfirmedAt?: Date;

    @Prop({
        type: String,
        required: false,
        unique: true,
        lowercase: true
    })
    newEmail?: string;

    @Prop({
        type: String,
        required: false
    })
    phoneNumber?: string;

    @Prop({
        type: String,
        required: true,
        enum: ProviderEnum,
        default:ProviderEnum.SYSTEM
    })
    provider: ProviderEnum;

    @Prop({
        type: String,
        required: true,
        enum: RoleEnum,
        default:RoleEnum.USER
    })
    role: RoleEnum;

    @Prop({
        type: String,
        required: false,
        enum: UserStatusEnum
    })
    status?: UserStatusEnum;

    @Prop({
        type: String,
        required: false,
        max: 500
    })
    bio?: string;

    @Prop({
        type: <I_UserSocial>{},
        required: false
    })
    socialLinks?: I_UserSocial;

    @Prop({
        type: String,
        required: function(this: User) { return this.provider === ProviderEnum.SYSTEM; },
    })
    password: string;

    @Prop({
        type: String,
        required: true,
        enum: GenderEnum
    })
    gender: GenderEnum;

    @Prop({
        type: String,
        required: true
    })
    dateOfBirth: string;

    @Prop({
        type: Date,
        required: false
    })
    changeCredentialsTime?: Date;

    @Prop({
        type: <I_File>{},
        required: false
    })
    profilePicture?: I_File;
    @Prop({
        type: <I_File>{},
        required: false
    })
    coverPicture?: I_File;
    @Prop({
        type: [<I_UserGallery>{}],
        required: false,
        default: []
    })
    gallery?: I_UserGallery[];

    @Prop({
        type: <I_File>{},
        required: false
    })
    resume?: I_File;

    @Prop({
        type: [String],
        required: false,
        default: []
    })
    skills? : string[];

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
        required: false
    })
    bannedBy?: Types.ObjectId;

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
        required: false
    })
    restoredBy?: Types.ObjectId;

}

export type H_UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);


UserSchema.index({ email: 1 });
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
export class UserModel implements I_User {

    @Prop({
        type: Types.ObjectId,
        required: true,
        auto: true
    })
    _id: Types.ObjectId;

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
        get: function (this: UserModel) {
            return `${this.firstName} ${this.lastName}`;
        },
        set: function (value: string) {
            const [firstName, lastName] = value.split(" ");
            this.set({ firstName, lastName });
        }
    })
    userName: string


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
        enum: ProviderEnum
    })
    provider: ProviderEnum;

    @Prop({
        type: String,
        required: true,
        enum: RoleEnum
    })
    role: RoleEnum;

    @Prop({
        type: String,
        required: true,
        enum: UserStatusEnum
    })
    status: UserStatusEnum;

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
        required: true
    })
    password: string;

    @Prop({
        type: String,
        required: true,
        enum: GenderEnum
    })
    gender: GenderEnum;

    @Prop({
        type: Date,
        required: true
    })
    dateOfBirth: Date;

    @Prop({
        type: Date,
        required: false
    })
    changeCredentialsTime?: Date;

    @Prop({
        type: <I_File>{},
        required: true
    })
    profilePicture: I_File;
    @Prop({
        type: <I_File>{},
        required: true
    })
    coverPicture: I_File;
    @Prop({
        type: [<I_UserGallery>{}],
        required: true,
        default: []
    })
    gallery: I_UserGallery[];

    @Prop({
        type: <I_File>{},
        required: true
    })
    resume: I_File;

    @Prop({
        type: [String],
        required: true,
        default: []
    })
    skills: string[];

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

export type H_UserDocument = HydratedDocument<UserModel>;

export const UserSchema = SchemaFactory.createForClass(UserModel);

MongooseModule.forFeature([
  { name: UserModel.name, schema: UserSchema }
])

UserSchema.index({ email: 1 });
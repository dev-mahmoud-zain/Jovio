import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { BrowserEnum, DeviceTypeEnum, I_DeviceInfo, I_Jwt, OSEnum } from "src/Common/Interfaces/jwt.interface";
import { TokenTypeEnum } from "src/Common/Types/token.types";

@Schema({ _id: false })
export class DeviceInfo implements I_DeviceInfo {
    @Prop({ enum: DeviceTypeEnum, required: true })
    type: DeviceTypeEnum;

    @Prop({ enum: OSEnum, required: true })
    os: OSEnum;

    @Prop({ enum: BrowserEnum, required: true })
    browser: BrowserEnum;
}

const DeviceInfoSchema = SchemaFactory.createForClass(DeviceInfo);



@Schema({
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strictQuery: true
})
export class Jwt implements I_Jwt {

    @Prop({ type: Types.ObjectId, ref: "User", required: true, index: true })
    userId: Types.ObjectId;

    @Prop({ required: true, unique: true })
    jti: string;

    @Prop({ required: true })
    token: string;

    @Prop({ enum: TokenTypeEnum, required: true })
    type: TokenTypeEnum;

    @Prop({ required: true, index: true })
    expiresAt: Date;

    @Prop({ default: false })
    revoked: boolean;

    @Prop({})
    revokedAt?: Date;

    @Prop({ type: DeviceInfoSchema, required: true })
    deviceInfo: DeviceInfo;

    @Prop({ required: true })
    ipAddress: string;

    @Prop({ required: true })
    userAgent: string;
}

export type H_JwtDocument = HydratedDocument<Jwt>;

export const JwtSchema = SchemaFactory.createForClass(Jwt);
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { I_Otp } from "src/Common/Interfaces/otp.interface";
import { OtpTypeEnum } from "src/Common/Types/otp.types";



@Schema({
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strictQuery: true
})

export class OTP implements I_Otp {

    @Prop({
        type: Types.ObjectId,
        required: true,
        ref: "User"
    })
    userId: Types.ObjectId;

    @Prop({
        type: String,
        required: true,
        length: 6
    })
    otp: string;

    @Prop({
        type: String,
        enum: Object.values(OtpTypeEnum),
        required: true,
    })
    type: OtpTypeEnum;

    @Prop({
        type: Date,
        required: true,
    })
    expiresAt: Date;

    @Prop({
        type: Boolean,
        default: false,
        required: true,
    })
    isUsed: Boolean;

    @Prop({
        type: Boolean,
        default: false,
        required: function (this: OTP) { return this.isUsed === true },
    })
    usedAt?: Date;


    @Prop({
        type: Number,
        default: 0,
        required: true,
    })
    attempts: number;

    @Prop({
        type: Date,
        required: function (this: OTP) { return this.attempts === 5 },
    })
    blockedUntil: Date;
}

export type H_OtpDocument = HydratedDocument<OTP>;

export const OtpSchema = SchemaFactory.createForClass(OTP);

OtpSchema.index({ userId: 1, otp: 1 });
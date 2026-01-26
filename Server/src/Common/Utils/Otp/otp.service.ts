import crypto from 'crypto';
import { Injectable } from "@nestjs/common";
import { OtpRepository } from 'src/Database/Repository/otp.repository';
import { Types } from 'mongoose';
import { OtpTypeEnum } from 'src/Common/Types/otp.types';
import { generateHash } from '../Security/hash';
import { EmailService } from '../Email/send-email';
import { ExceptionFactory } from '../Response/error.response';


const ErrorResponse = new ExceptionFactory();


@Injectable()
export class OtpService {

    constructor(
        private readonly otpRepository: OtpRepository,
        private readonly emailService: EmailService,

    ) { }


    private generateCode() {
        return crypto.randomUUID().slice(0, 6).toUpperCase();
    }

    async sendOtpToEmail({
        userId,
        email,
        type
    }: {
        userId: Types.ObjectId,
        email: string,
        type: OtpTypeEnum,
    }) {
        const plainOtp = this.generateCode();

        if (! await this.otpRepository.create({
            data: [{
                userId,
                otp: await generateHash({ text: plainOtp }),
                type,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000)
            }]
        })) {

            throw ErrorResponse.serverError({
                message: "Fail To Create Otp Code"
            })

        }



        switch (type) {
            case OtpTypeEnum.VERIFY_ACCOUNT:

                this.emailService.verifyAccount({
                    email,
                    OTPCode: plainOtp
                })

                break;

            case OtpTypeEnum.CONFIRM_EMAIL:

                /*                 this.emailService.verifyAccount({
                                    email,
                                    OTPCode: plainOtp
                                }) */

                break;

            default:
                break;
        }



    }

    




}
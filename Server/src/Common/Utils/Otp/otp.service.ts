import crypto from 'crypto';
import { Injectable } from "@nestjs/common";
import { OtpRepository } from 'src/Database/Repository/otp.repository';
import { Types } from 'mongoose';
import { OtpTypeEnum } from 'src/Common/Types/otp.types';
import { compareHash, generateHash } from '../Security/hash';
import { EmailService } from '../Email/send-email';
import { ExceptionFactory } from '../Response/error.response';
import { EncryptionService } from '../Security/encryption';


const ErrorResponse = new ExceptionFactory();


@Injectable()
export class OtpService {

    constructor(
        private readonly otpRepository: OtpRepository,
        private readonly emailService: EmailService,
        private readonly encryptionService: EncryptionService
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

            case OtpTypeEnum.FORGET_PASSWORD:

                this.emailService.forgetPassword({
                    email,
                    OTPCode: plainOtp
                })

                break;

            default:
                break;
        }

    }

    async verifyOtp({
        userId,
        otpCode,
        type
    }: {
        userId: Types.ObjectId,
        otpCode: string,
        type?: OtpTypeEnum // ممكن احتاجه بعدين بس لسة مش عارف هحتاجه في ايه
    }) {

        const otp = await this.otpRepository.findOne({
            filter: {
                userId,
                isUsed: false
            }
        })

        if (!otp) {
            throw ErrorResponse.notFound({
                message: "No Otp Found For This User"
            })
        }

        if (otp.expiresAt <= new Date) {
            throw ErrorResponse.badRequest({
                message: "Your Otp Code Was Expired"
            })
        }

        if (!await compareHash({
            plainText: otpCode,
            hashText: otp.otp
        })) {

            throw ErrorResponse.badRequest({
                message: "Invalid Otp Code"
            });
        }


        const updated = await this.otpRepository.updateOne({
            filter: {
                _id: otp._id
            },
            update: {
                $set: {
                    isUsed: true
                }
            }

        });

        if (!updated.modifiedCount) {
            throw ErrorResponse.serverError({
                message: "Fail To Verify Otp Now , Please try again later"
            })
        }

        return true;

    }

}
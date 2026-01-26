import { _default } from './../../../node_modules/@types/validator/index.d';
import { UserRepository } from './../../Database/Repository/user.repository';
import { Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { ExceptionFactory } from 'src/Common/Utils/Response/error.response';
import { generateHash } from 'src/Common/Utils/Security/hash';
import { EncryptionService } from 'src/Common/Utils/Security/encryption';
import { OtpService } from 'src/Common/Utils/Otp/otp.service';
import { OtpTypeEnum } from 'src/Common/Types/otp.types';
import { VerifyAccountDto } from './dto/verify.account.dto';


const ErrorResponse = new ExceptionFactory();

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly encryptionService: EncryptionService,
        private readonly otpService: OtpService
    ) { }

    async signup(body: SignupDto) {

        await this.userRepository.findExistsUser({
            filter: [
                { key: 'email', value: body.email },
                { key: 'phoneNumber', value: body.phoneNumber || '' }
            ],
            throwError: true
        });

        const { confirmPassword, ...userData } = body

        userData.password = await generateHash({
            text: body.password
        })

        const plainEmail = userData.email;

        userData.email = this.encryptionService.encrypt(userData.email);
        userData.phoneNumber = this.encryptionService.encrypt(userData.phoneNumber);

        const [user] = await this.userRepository.create({
            data: [
                {
                    ...userData
                }
            ]
        }) || []

        if (!user) {
            throw ErrorResponse.serverError({
                message: "Fail To Sign-up Please Retry Another Time"
            })
        }

        this.otpService.sendOtpToEmail({
            email: plainEmail,
            userId: user._id,
            type: OtpTypeEnum.VERIFY_ACCOUNT
        })


    }


    async verifyAccount(body: VerifyAccountDto) {

        const { email, otpCode } = body

        const user = await this.userRepository.findExistsUser({
            filter: [{
                key: "email",
                value: email
            }],
            throwError: false
        },);

        if (!user) {
            throw ErrorResponse.notFound({
                message: "No User Matched With This Email " + email
            });
        }


        await this.otpService.verifyOtp({
            userId: user._id,
            otpCode
        });

        user.emailConfirmedAt = new Date;
        user.save()


    }



}
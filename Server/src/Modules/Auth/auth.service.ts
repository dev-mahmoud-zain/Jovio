import { ClientInfoService } from './../../Common/Utils/Security/client-info.service';
import { JwtRepository } from './../../Database/Repository/jwt.repository';
import { _default } from './../../../node_modules/@types/validator/index.d';
import { UserRepository } from './../../Database/Repository/user.repository';
import { Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { ExceptionFactory } from 'src/Common/Utils/Response/error.response';
import { compareHash, generateHash } from 'src/Common/Utils/Security/hash';
import { EncryptionService } from 'src/Common/Utils/Security/encryption';
import { OtpService } from 'src/Common/Utils/Otp/otp.service';
import { OtpTypeEnum } from 'src/Common/Types/otp.types';
import { VerifyAccountDto } from './dto/verify.account.dto';
import { SystemLoginDto } from './dto/login.dto';
import { TokenService, TokenTypeEnum } from 'src/Common/Utils/Security/token.service';
import { Request, Response } from 'express';
import { CookiesService } from 'src/Common/Utils/Cookies/cookies.service';
import { UserStatusEnum } from 'src/Common/Enums/user.status.enum';


const ErrorResponse = new ExceptionFactory();

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly encryptionService: EncryptionService,
        private readonly otpService: OtpService,
        private readonly tokenService: TokenService,
        private readonly cookiesService: CookiesService,
        private readonly jwtRepository: JwtRepository,
        private readonly clientInfoService: ClientInfoService

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

    async login(body: SystemLoginDto, res: Response, req: Request) {


        // Check If User Exist
        const user = await this.userRepository.findExistsUser({
            filter: [{
                key: "email",
                value: body.email
            }],
            throwError: false
        });

        const message: string = "Invalid Login Data";

        if (!user) {
            throw ErrorResponse.unauthorized({
                message
            })
        }

        // Check If Account Confirmed
        if (user && !user.emailConfirmedAt) {
            throw ErrorResponse.badRequest({
                message: "Please Verify Your Account To Login"
            })
        }

        // Check If User Banned
        if (user.bannedAt) {
            throw ErrorResponse.forbidden({
                message: "Your account has been banned",
                info: user.bannedReason
            });
        }

        // Compare Password With Hashed 
        if (!compareHash({
            plainText: body.password,
            hashText: user.password
        })) {
            throw ErrorResponse.unauthorized({
                message
            })
        }

        // Get User Session Context
        const session = this.clientInfoService.getUserSessionContext(req);


        // Create Tokens
        const { access_token, refresh_token } = await this.tokenService.createLoginCredentials(user._id, user.role);

        // Send Tokens To User's Cookies
        this.cookiesService.setTokenToCookies(res, access_token.token, TokenTypeEnum.ACCESS);
        this.cookiesService.setTokenToCookies(res, refresh_token.token, TokenTypeEnum.REFRESH);


        try {
            await Promise.all([

                // Save Jwt In Database
                this.tokenService.saveJwt(user._id, access_token.jti, access_token.token, TokenTypeEnum.ACCESS, session),

                this.tokenService.saveJwt(user._id, refresh_token.jti, refresh_token.token, TokenTypeEnum.REFRESH, session),

                // Revoke Old Session Token In Database
                this.jwtRepository.updateMany({
                    filter: {
                        jti: { $nin: [access_token.jti, refresh_token.jti] },
                        userId: user._id,
                        ipAddress: session.ipAddress,
                        userAgent: session.userAgent,
                        "deviceInfo.type": session.deviceInfo.type,
                        "deviceInfo.os": session.deviceInfo.os,
                        "deviceInfo.browser": session.deviceInfo.browser
                    },
                    update: {
                        revoked: true,
                        revokedAt: new Date()
                    }
                })


            ]);
        } catch (err) {
            throw ErrorResponse.serverError({ message: 'Login failed , please try again', err });
        }

        return { userId: user._id, email: user.email, role: user.role, fullName: user.fullName }

    }

}
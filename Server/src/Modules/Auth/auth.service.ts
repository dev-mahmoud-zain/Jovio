import { ProviderEnum } from 'src/Common/Enums/provider.enum';
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
import { TokenService, TokenTypeEnum, SignatureLevelEnum } from 'src/Common/Utils/Security/token.service';
import { Request, Response } from 'express';
import { CookiesService } from 'src/Common/Utils/Cookies/cookies.service';
import { I_Request } from 'src/Common/Interfaces/request.interface';
import { Types } from 'mongoose';
import { I_User } from 'src/Common/Interfaces/user.interface';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { I_Jwt } from 'src/Common/Interfaces/jwt.interface';


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


    // ===> Private Method Used At Many Requests

    private async setUserLogin(req: Request, res: Response, user: I_User) {

        // Get User Session Context
        const session = this.clientInfoService.getUserSessionContext(req);


        // Create Tokens
        const { access_token, refresh_token } = await this.tokenService.createLoginCredentials(user._id!, user.role);

        // Send Tokens To User's Cookies
        this.cookiesService.setTokenToCookies(res, access_token.token, TokenTypeEnum.ACCESS);
        this.cookiesService.setTokenToCookies(res, refresh_token.token, TokenTypeEnum.REFRESH);


        try {
            await Promise.all([

                // Save Jwt In Database
                this.tokenService.saveJwt(user._id!, access_token.jti, access_token.token, TokenTypeEnum.ACCESS, session),

                this.tokenService.saveJwt(user._id!, refresh_token.jti, refresh_token.token, TokenTypeEnum.REFRESH, session),

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

        return { userId: user._id, email: user.email, role: user.role, fullName: user.fullName };

    }

    private verifyGmailAccount = async (
        id_token: string
    ): Promise<TokenPayload> => {

        try {

            const client = new OAuth2Client();

            let ticket = await client.verifyIdToken({
                idToken: id_token,
                audience: process.env.WEB_CLIENT_ID as string,
            });

            const payload = ticket.getPayload();

            if (!payload?.email_verified) {
                throw ErrorResponse.badRequest({
                    message: "Fail To Verify This Account"
                })
            }

            return payload;

        } catch (error) {
            throw ErrorResponse.badRequest(error)
        }


    };

    private signupWithGmail = async (email: string, fullName: string, picture?: string) => {

        const [user] = await this.userRepository.create({
            data: [{
                fullName,
                email: this.encryptionService.encrypt(email),
                profilePicture: {
                    url: picture || undefined,
                    public_id: undefined
                },
                provider: ProviderEnum.GOOGLE
            }]
        }) || []


        if (!user) {
            throw ErrorResponse.serverError({
                message: "Fail To Sign-up Please Retry Another Time"
            })
        }

        return user;

    }

    private async validateAccount(user: I_User, password?: string) {



        // Check If Account Confirmed
        if (!user.emailConfirmedAt && user.provider === ProviderEnum.SYSTEM) {
            throw ErrorResponse.badRequest({
                message: "Please Verify Your Account First"
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
        if (password) {

            if (user!.provider === ProviderEnum.GOOGLE || !user!.password) {
                throw ErrorResponse.badRequest({
                    message: "You Have No Password , Try Login Using Google Account"
                })
            }


            if (user.provider === ProviderEnum.SYSTEM && ! await compareHash({
                plainText: password,
                hashText: user.password
            })) {

                throw ErrorResponse.unauthorized({
                    message: "Invalid Login Data"
                })


            }

        }


        return true


    }


    // ==================================== Registration & Verification ====================================

    // ===> Register A New Account

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

    // ===> Verify Email For New Account

    async verifyAccount(req: Request, res: Response, body: VerifyAccountDto) {

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

        return await this.setUserLogin(req, res, user);



    }


    // ===> Verify Email For New Account

    async authWithGoogle(req: Request, res: Response, id_token: string) {

        const { email, name, picture } = await this.verifyGmailAccount(id_token)

        const user = await this.userRepository.findByEmail({ email: email as string })




        if (!user) {

            const newUser = await this.signupWithGmail(email!, name!, picture)

            const data = await this.setUserLogin(req, res, newUser);

            return {
                message: "Signed Up Successfully",
                info: "User Credentials Saved In Cookies",
                data
            }

        }
        else {
            const data = await this.setUserLogin(req, res, user)

            return {
                message: "Login Successfully",
                info: "User Credentials Saved In Cookies",
                data
            }

        }


    }

    // ================================ Authentication & Session Management ================================

    // ===> Login By [ Email And Password ]

    async login(body: SystemLoginDto, res: Response, req: Request) {


        // Check If User Exist
        const user = await this.userRepository.findExistsUser({
            filter: [{
                key: "email",
                value: body.email
            }],
            throwError: false
        });

        if (!user) {
            throw ErrorResponse.unauthorized({
                message: "Invalid Login Data"
            })
        }


        await this.validateAccount(user, body.password)


        return await this.setUserLogin(req, res, user);




    }

    // ===> Refresh Access Token

    async refreshToken(user: I_User, refresh_token: string, req: I_Request, res: Response) {

        const session = this.clientInfoService.getUserSessionContext(req);

        const signature = refresh_token.split(" ")[0] === SignatureLevelEnum.BEARER ? SignatureLevelEnum.BEARER : SignatureLevelEnum.SYSTEM

        const access_token = await this.tokenService.createRefreshToken(user._id as Types.ObjectId, user.role, signature)

        this.cookiesService.setTokenToCookies(res, access_token.token, TokenTypeEnum.ACCESS);

        await this.tokenService.saveJwt(user._id as Types.ObjectId, access_token.jti, access_token.token, TokenTypeEnum.ACCESS, session)

        return access_token
    }

    // ===> Logout

    async logout(req: I_Request, res: Response) {
        try {

            await Promise.all([
                this.tokenService.revokeToken(req.cookies["access_token"], TokenTypeEnum.ACCESS),

                this.tokenService.revokeToken(req.cookies["refresh_token"], TokenTypeEnum.REFRESH),
            ]);


            this.cookiesService.removeTokenFromCookies(res, TokenTypeEnum.ACCESS);

            this.cookiesService.removeTokenFromCookies(res, TokenTypeEnum.REFRESH);


        } catch (error) {

            throw ErrorResponse.serverError({
                message: "Fail To Logout Please Try Again",
            });
        }
    }


    // ===> Get User Sessions


    async getSessions(userId: Types.ObjectId, currentJti: string) {

        const sessions = await this.tokenService.getSessions(userId);

        const currentSession = sessions.find(
            session => session.jti === currentJti
        ) || null;

        const otherSessions = sessions.filter(
            session => session.jti !== currentJti
        );

        return {
            currentSession,
            otherSessions,
            count: {
                total: sessions.length,
                others: otherSessions.length
            }
        };

    }

    // ===> Revoke Sessions


    async revokeSession(sessionId: Types.ObjectId, currentJti: string, res: Response) {

        const result = await this.tokenService.revokeSession(sessionId, currentJti);

        if (result === "eq") {
            this.cookiesService.removeTokenFromCookies(res, TokenTypeEnum.ACCESS);

            this.cookiesService.removeTokenFromCookies(res, TokenTypeEnum.REFRESH);

            return "Logout Success"
        }

        return "Session Revoked Success"
    }


    // ======================================== Security & Recovery ========================================

    // ===> Request Password Reset

    async forgetPassword(email: string) {

        const user = await this.userRepository.findByEmail({
            email
        });

        await this.validateAccount(user!)

        await this.otpService.sendOtpToEmail({
            userId: user!._id,
            email,
            type: OtpTypeEnum.FORGET_PASSWORD
        });



    }

    // ===> Request Password Reset

    async confirmResetPassword(req: Request, res: Response, otpCode: string, email: string, password: string) {

        const user = await this.userRepository.findByEmail({
            email
        });

        await this.validateAccount(user!)

        await this.otpService.verifyOtp({
            userId: user!._id,
            otpCode,
            type: OtpTypeEnum.FORGET_PASSWORD
        });

        user!.password = await generateHash({
            text: password
        });

        await user!.save()

        return await this.login({ email, password }, res, req)

    }

    // ===> Change Password 


    async changePassword(id: Types.ObjectId, currentPassword: string, newPassword: string) {

        const user = await this.userRepository.findById({
            id: id
        })


        if (!await compareHash({
            plainText: currentPassword,
            hashText: user!.password
        })) {
            throw ErrorResponse.forbidden({
                message: "Fail To Update Password",
                issus: [{
                    path: "currentPassword",
                    info: "User Password Is Incorrect"
                }]
            })
        }

        if (currentPassword === newPassword) {
            throw ErrorResponse.badRequest({
                message: "Fail To Update Password",
                issus: [{
                    path: "newPassword",
                    info: 'New password must be different from the current password',
                }]
            });
        }



        user!.password = await generateHash({
            text: newPassword
        });


        await user!.save();
        
    }


}
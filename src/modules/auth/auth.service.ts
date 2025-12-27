import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { TokenRepository, UserDocument, UserRepository } from 'src/DATABASE';
import {
  compareHash,
  emailEvent,
  ExceptionFactory,
  generateHash,
  generateOTP,
  SuccessResponse,
} from 'src/common/utils';
import { LoginDto } from './dto/login.dto';
import {
  EmailEventsEnum,
  OTP_TypeEnum,
  ProviderEnum,
  TokenService,
} from 'src/common';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { ReSend_OTP_Dto } from './dto/re-send-otp.dto';
import { SignUpWithGmailDto } from './dto/signup-with-gmail.dto';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { ForgetPasswordDto, ReSetPasswordDto } from './dto/forget-password.dto';
import { Types } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AppHelpers } from 'src/common/helpers/users.helpers';

@Injectable()
export class AuthService {
  constructor(
    private readonly userModel: UserRepository,
    private readonly errorResponse: ExceptionFactory,
    private readonly tokenService: TokenService,
    private readonly appHelpers: AppHelpers,
    private readonly tokenModel: TokenRepository,
  ) {}

  // ================================ Account Registration & Email Verification ================================

  // ====> SignUp
  async signUp(body: SignUpDto) {
    const message = 'Fail To Sign Up';

    const userExists = await this.userModel.findOne({
      filter: {
        email: body.email,
      },
    });

    if (userExists) {
      if (userExists && userExists.provider === ProviderEnum.google) {
        throw this.errorResponse.badRequest({
          message,
          issus: [
            {
              path: 'email',
              info: `Your Email ${body.email} Is Used In Another Provider , Try To Login Using Google Account`,
            },
          ],
        });
      }

      throw this.errorResponse.badRequest({
        message,
        issus: [
          {
            path: 'email',
            info: `Your Email ${body.email} Is Used Before , Try To Login Or Use Another Email`,
          },
        ],
      });
    }

    const [user] =
      (await this.userModel.create({
        data: [
          {
            ...body,
          },
        ],
      })) || [];

    if (!user) {
      throw this.errorResponse.serverError({
        message,
        info: 'A Server Error Occurred While Creating Your Account. Our Team Has Been Notified And Is Working To Resolve It. Please Try Again Later.',
      });
    }

    return SuccessResponse({
      info: 'Signup completed successfully. Please check your email to verify your account.',
    });
  }

  // ====> Confirm Email
  async confirmEmail(body: ConfirmEmailDto) {
    const message = 'Fail To Confirm Email';

    const user = await this.userModel.getUser({
      filter: {
        email: body.email,
      },
      error: {
        message,
      },
    });

    if (!user) {
      throw this.errorResponse.notFound({
        message,
        info: 'No User Found With This Email , Please Try To Signing Up.',
      });
    }

    if (user.emailConfirmedAt) {
      throw this.errorResponse.badRequest({
        message,
        info: 'This Email Is Confirmed Before , Try To Login',
      });
    }

    if (!user.OTP_Code || user.OTP_Code.type !== OTP_TypeEnum.confirm_Email) {
      throw this.errorResponse.badRequest({
        message,
        info: 'No Matched OTP Code Found. Please Request A New Activation Code.',
      });
    }

    if (user.OTP_Code.expiresAt < new Date()) {
      throw this.errorResponse.badRequest({
        message,
        info: 'Your OTP Code Is Expired , Request A New OTP Code',
      });
    }

    if (!(await compareHash(body.OTP_Code, user.OTP_Code.code))) {
      throw this.errorResponse.badRequest({
        message,
        info: 'Invalid OTP Code',
      });
    }

    this.userModel.updateOne(
      {
        _id: user._id,
      },
      {
        $set: {
          emailConfirmedAt: new Date(),
        },
        $unset: {
          OTP_Code: true,
          OTP_Block_ExpiresAt: true,
          OTP_Count: true,
        },
      },
    );

    const credentials = await this.tokenService.createLoginCredentials(
      user as UserDocument,
    );

    return credentials;
  }

  // ====> Re Send OTP
  async reSendOTP(body: ReSend_OTP_Dto) {
    const message = 'Fail To Send OTP Code';
    let type: OTP_TypeEnum;

    let user = await this.userModel.findOne({
      filter: {
        email: body.email,
      },
    });

    if (!user) {
      throw this.errorResponse.notFound({
        message,
        info: 'No User Found With This Email , Please Try To Signing Up.',
      });
    }

    if (!user.OTP_Code) {
      throw this.errorResponse.badRequest({
        message,
        info: 'No OTP Code Requested',
      });
    }

    type = user.OTP_Code.type;

    //  لسة مش واخد بلوك بس وصل الحد الاقصى
    if (!user.OTP_Block_ExpiresAt && user.OTP_Count === 5) {
      this.userModel.updateOne(
        {
          email: body.email,
        },
        {
          OTP_Block_ExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
      );

      throw this.errorResponse.badRequest({
        message,
        info: 'Max 5 Attempts Reached. Try Again In 10 Minutes.',
      });
    }

    // واخد بلوك
    if (user.OTP_Block_ExpiresAt) {
      // لسة واخد بلوك
      if (user.OTP_Block_ExpiresAt > new Date()) {
        const now = new Date();
        const remainingMs = user.OTP_Block_ExpiresAt.getTime() - now.getTime();

        const remainingSeconds = Math.floor(remainingMs / 1000) % 60;
        const remainingMinutes = Math.floor(remainingMs / (1000 * 60));

        let timeLeft = '';
        if (remainingMinutes > 0) timeLeft += `${remainingMinutes}m `;
        timeLeft += `${remainingSeconds}s`;

        throw this.errorResponse.badRequest({
          message,
          info: `Maximum Attempts Reached. Try Again In ${timeLeft}.`,
        });
      }

      // نفك البلوك عشان الوقت خلص
      else {
        user = await this.userModel.findOneAndUpdate({
          filter: { email: body.email },
          updateData: {
            $unset: { OTP_Block_ExpiresAt: 1 },
            OTP_Count: 0,
          },
        });
      }
    }

    if (type !== OTP_TypeEnum.update_Email) {
      this.userModel.updateOne(
        { email: body.email },
        {
          $set: {
            OTP_Count: user?.OTP_Count ? user.OTP_Count + 1 : 1,
            OTP_Code: {
              type,
            },
          },
        },
      );
    } else {
      const _Plain_OTP = generateOTP();

      this.userModel.updateOne(
        { email: body.email },
        {
          $set: {
            OTP_Count: user?.OTP_Count ? user.OTP_Count + 1 : 1,
            OTP_Code: {
              code: await generateHash(_Plain_OTP),
              type: OTP_TypeEnum.update_Email,
              expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            },
          },
        },
      );

      emailEvent.emit(EmailEventsEnum.update_Email, {
        to: user?.newEmail,
        OTP_Code: _Plain_OTP,
      });
    }

    return SuccessResponse({
      message: 'OTP Sent To Your Email Successfully.',
    });
  }

  // ========== Google Auth ==========

  // ====>
  private verifyGmailAccount = async (
    id_token: string,
  ): Promise<TokenPayload> => {
    const client = new OAuth2Client();
    const message = 'Fail To Verify This Account';

    try {
      const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: process.env.WEB_CLIENT_ID as string,
      });

      const payload = ticket.getPayload();

      if (!payload?.email_verified) {
        throw this.errorResponse.badRequest({
          message: 'Email Is Not Verified',
        });
      }

      return payload;
    } catch (err: any) {
      const isInvalidToken =
        err?.message?.includes('Invalid token') ||
        err?.message?.includes('Wrong number of segments') ||
        err?.message?.includes('invalid');

      if (isInvalidToken) {
        throw this.errorResponse.badRequest({
          message: 'Invalid Gmail Token',
          info: 'The Provided Google Token Is Corrupted Or Expired.',
        });
      }

      if (err?.message?.includes('Token used too late')) {
        throw this.errorResponse.badRequest({
          message,
          info: 'Token Used Is Expired',
        });
      }

      throw this.errorResponse.badRequest({
        message,
        info: err?.message,
      });
    }
  };

  // ====> Login With Gmail
  async loginWithGmail(data: SignUpWithGmailDto) {
    const message = 'Fail To Login Using Google';

    const { id_token }: SignUpWithGmailDto = data;
    const { email }: TokenPayload = await this.verifyGmailAccount(id_token);

    const user = (await this.userModel.findOne({
      filter: {
        email,
        provider: ProviderEnum.google,
      },
    })) as UserDocument;

    if (!user) {
      throw this.errorResponse.badRequest({
        message,
        info: `Not Registered Account Or Registered With System Provider`,
      });
    }

    const credentials = await this.tokenService.createLoginCredentials(user);

    return { credentials, statusCode: 200 };
  }

  // ====> Signup With Gmail
  async signupWithGmail(data: SignUpWithGmailDto) {
    const message = 'Fail To Sign Up Using Google';
    const { id_token }: SignUpWithGmailDto = data;

    const { email, name, picture }: TokenPayload =
      await this.verifyGmailAccount(id_token);

    const user = await this.userModel.findOne({
      filter: {
        email,
      },
    });

    if (user) {
      if (user.provider === ProviderEnum.google) {
        return await this.loginWithGmail(data);
      }
      throw this.errorResponse.badRequest({
        message,
        info: `Account Registered With System Provider`,
      });
    }

    const [newUser] =
      (await this.userModel.create({
        data: [
          {
            userName: name as string,
            email: email as string,
            emailConfirmedAt: new Date(),
            provider: ProviderEnum.google,
            profilePicture: {
              public_id: '',
              url: picture || '',
            },
          },
        ],
      })) || [];

    if (!newUser) {
      throw this.errorResponse.serverError({
        message: 'Server Error',
        info: 'Something Went Wrong , Please Try Again',
      });
    }

    const credentials = await this.tokenService.createLoginCredentials(newUser);

    return { credentials, statusCode: 201 };
  }

  // ======================================== Login & Session Management ========================================

  // ====> Login
  async login(body: LoginDto) {
    const message = 'Fail To Login';

    const user = await this.userModel.getUser({
      filter: {
        email: body.email,
      },
      error: {
        message,
      },
    });

    if (user.provider === ProviderEnum.google) {
      throw this.errorResponse.notFound({
        message: 'Fail To Sign Up',
        info: `Your Email ${body.email} Is Used In Another Provider , Try To Login Using Google Account`,
      });
    }

    if (!user.emailConfirmedAt) {
      throw this.errorResponse.badRequest({
        message,
        info: 'Please confirm your email to complete login.',
      });
    }

    if (
      user.email !== body.email ||
      !(await compareHash(body.password, user.password))
    ) {
      throw this.errorResponse.badRequest({
        message,
        info: 'Invalid Email Or Password.',
      });
    }

    const credentials = await this.tokenService.createLoginCredentials(
      user as UserDocument,
    );

    return credentials;
  }

  async logout(
    jti: string,
    iat: number,
    flag: string,
    userId: Types.ObjectId,
  ) {


    if (flag === 'all') {
      this.userModel.updateOne(
        {
          _id: userId,
        },
        {
          changeCredentialsTime: new Date(),
        },
      );
    }

    this.tokenModel.create({
      data: [
        {
          createdBy: userId,
          jti,
          expiresAt: new Date(iat * 1000 + 7 * 24 * 60 * 60 * 1000),
        },
      ],
    });

    return SuccessResponse({
      message: 'Logout success',
    });
  }

  // ====> Refresh Token
  async refreshToken(userId: Types.ObjectId, iat: number) {
    const user = await this.userModel.getUser({
      filter: {
        _id: userId,
      },
    });

    const credentials = await this.tokenService.createLoginCredentials(user);

    return credentials;
  }

  // =================================== Password Reset (Forget Password Flow) ==================================

  // ====> Forget Password
  async forgetPassword(body: ForgetPasswordDto) {
    const message = 'Fail To Request';

    const user = await this.userModel.getUser({
      filter: {
        email: body.email,
      },
      error: {
        message,
      },
    });

    if (user.provider !== ProviderEnum.system) {
      throw this.errorResponse.notFound({
        message,
        info: `Your Email ${body.email} Is Used In Another Provider , Try To Login Using Google Account`,
      });
    }

    if (user.OTP_Code?.type === OTP_TypeEnum.forget_Password) {
      throw this.errorResponse.notFound({
        message,
        info: `You Already Has Forget Password OTP Code , Use It To Confirm Reset Password`,
      });
    }

    this.userModel.updateOne(
      {
        email: body.email,
      },
      {
        $set: {
          OTP_Code: {
            type: OTP_TypeEnum.forget_Password,
          },
          changeCredentialsTime: new Date(),
        },
      },
    );

    return SuccessResponse({
      message: 'Done',
      info: 'OTP Code Sent To Your Email',
    });
  }

  // ====> Re Set Password

  async reSetPassword(body: ReSetPasswordDto) {
    const message = 'Fail To Reset Password';

    const user = await this.userModel.getUser({
      filter: {
        email: body.email,
      },
      error: {
        message,
      },
    });

    // Check OTP Exists

    await this.appHelpers.ValidateOTP(
      user,
      body.OTP_Code,
      OTP_TypeEnum.forget_Password,
    );

    await this.userModel.updateOne(
      { _id: user._id },
      {
        $set: { password: body.password, changeCredentialsTime: new Date() },
        $unset: {
          OTP_Code: true,
          OTP_Block_ExpiresAt: true,
          OTP_Count: true,
        },
      },
    );

    const credentials = await this.tokenService.createLoginCredentials(
      user as UserDocument,
    );

    return SuccessResponse({
      message: 'Password Reset Successfully.',
      data: {
        credentials,
      },
    });
  }

  // =================================================  Cron Job  ================================================

  // ====> Clear Expired OTPs
  @Cron(CronExpression.EVERY_6_HOURS)
  async clearExpiredOTPs() {
    try {
      const result = await this.userModel.updateMany(
        //  هدي فرصة 20 دقيقة عشان لو اليوزر لسة ممكن يعمل ريكوست تاني بعد ما ينتهي
        {
          'OTP_Code.expiresAt': { $lt: new Date(Date.now() - 20 * 60 * 1000) },
        },
        {
          $unset: {
            OTP_Code: '',
            OTP_Count: '',
            OTP_Block_ExpiresAt: '',
          },
          $inc: { __v: 1 },
        },
        { pranoId: true },
      );

      console.log(
        `Expired OTPs cleared. Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`,
      );
    } catch (err) {
      console.error('Failed to clear expired OTPs', err);
    }
  }
}

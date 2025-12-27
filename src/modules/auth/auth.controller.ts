import {
  Body,
  Controller,
  Get,

  Post,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { ReSend_OTP_Dto } from './dto/re-send-otp.dto';
import { SignUpWithGmailDto } from './dto/signup-with-gmail.dto';
import { ForgetPasswordDto, ReSetPasswordDto } from './dto/forget-password.dto';
import {
  Auth,
  SuccessResponse,
  TokenTypeEnum,
  type IRequest,
} from 'src/common';
import { Types } from 'mongoose';
import type { Response } from 'express';
import { clearTokenCookie, setTokenCookie } from 'src/common/utils';
import { LogoutDto } from './dto/logout.dto';

@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ================================== Account Registration & Email Verification ==================================

  // ====> SignUp
  @Post('signup')
  signUp(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
  }

  // ====> Confirm Email
  @Post('confirm-email')
  async confirmEmail(
    @Body() body: ConfirmEmailDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const credentials = await this.authService.confirmEmail(body);

    setTokenCookie(res, credentials);

    return SuccessResponse({
      message: 'Email Confirmed Successfully.',
      info: 'Credentials Saved In User Cookies',
    });
  }

  // ====> Re Send OTP

  @Post('resend-otp')
  reSendOTP(@Body() body: ReSend_OTP_Dto) {
    return this.authService.reSendOTP(body);
  }

  // ====> Signup Or Login With Gmail

  @Post('login-gmail')
  async signUpWithGmail(
    @Body() body: SignUpWithGmailDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { credentials, statusCode } =
      await this.authService.signupWithGmail(body);

    setTokenCookie(res, credentials);

    let message: string = 'Done';

    if (statusCode === 201) message = 'Signup Successfully';

    if (statusCode === 200) message = 'Login Successfully';

    return SuccessResponse({
      message,
      statusCode,
      info: 'Credentials Saved In User Cookies',
    });
  }

  // ======================================== Login & Session Management ========================================

  // ====> Login

  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const credentials = await this.authService.login(body);

    setTokenCookie(res, credentials);

    return SuccessResponse({
      message: 'Login Successfully',
      info: 'Credentials Saved In User Cookies',
    });
  }

  // ====> logout
  @Auth()
  @Post('logout')
  async logout(
    @Req() req: IRequest,
    @Body() body: LogoutDto,
    @Res({ passthrough: true }) res: Response,
  ) {

    clearTokenCookie(res)

   return  await this.authService.logout(
      req.credentials?.decoded.jti as string,
      req.credentials?.decoded.iat as number,
      body.logoutFlag || 'current',
      req.credentials?.user._id as Types.ObjectId,
    );


 
  }

  // ====> Refresh Token
  @Auth([], TokenTypeEnum.refresh)
  @Get('refresh-token')
  async refreshToken(
    @Req() req: IRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const credentials = await this.authService.refreshToken(
      req.credentials?.user._id as Types.ObjectId,
      req.credentials?.decoded.iat as number,
    );

    setTokenCookie(res, credentials);

    return SuccessResponse({
      message: 'Token Refresh Successfully',
      info: 'Credentials Saved In User Cookies',
    });
  }

  // =================================== Password Reset (Forget Password Flow) ==================================

  // ====> Forget Password

  @Post('forget-password')
  forgetPassword(@Body() body: ForgetPasswordDto) {
    return this.authService.forgetPassword(body);
  }

  @Post('reset-password')
  reSetPassword(@Body() body: ReSetPasswordDto) {
    return this.authService.reSetPassword(body);
  }
}

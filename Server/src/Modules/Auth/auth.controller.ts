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
import { SignupDto } from './dto/signup.dto';
import { VerifyAccountDto } from './dto/verify.account.dto';
import { SystemLoginDto } from './dto/login.dto';
import { SuccessResponse } from 'src/Common/Utils/Response/success.response';
import type { Request, Response } from 'express';

@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('sign-up')
  async signUp(@Body() body: SignupDto) {
    await this.authService.signup(body);
    return SuccessResponse({
      message: 'Confirmation OTP sent to your email.'
    });
  }

  @Post('verify-account')
  async verifyAccount(@Body() body: VerifyAccountDto) {
    await this.authService.verifyAccount(body);

    // تاني login  المفروض ارجعله توكن عشان ميعملش ريكوست 

    return SuccessResponse({
      message: 'Account Verified successfully.'
    });

  }

  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() body: SystemLoginDto
  ) {

    const credentials = await this.authService.login(body, res);

    return SuccessResponse({
      message: 'Login successfully.',
      info: "User Credentials Saved In Cookies",
      data: credentials
    });

  }

  @Get('refresh-token')
  async refreshToken(
    @Req() req: Request,
  ) {

    console.log(req.cookies)


    return SuccessResponse({
      message: 'Authenticated successfully.',
    });

  }

}
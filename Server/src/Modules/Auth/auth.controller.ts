import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  SetMetadata,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { VerifyAccountDto } from './dto/verify.account.dto';
import { LoginWithGoogleDto, SystemLoginDto } from './dto/login.dto';
import { SuccessResponse } from 'src/Common/Utils/Response/success.response';
import type { Request, Response } from 'express';
import { AuthenticationGuard } from 'src/Common/Guards/Authentication/authentication.guard';
import { TokenTypeEnum } from 'src/Common/Utils/Security/token.service';
import type { I_Request } from 'src/Common/Interfaces/request.interface';

@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }




  // ==================================== Registration & Verification ====================================


  // ===> Register A New Account

  @Post('sign-up')
  async signUp(@Body() body: SignupDto) {
    await this.authService.signup(body);
    return SuccessResponse({
      message: 'Confirmation OTP sent to your email.',
      statusCode: 201
    });
  }


  // ===> Verify Email For New Account

  @Post('verify-account')
  async verifyAccount(@Body() body: VerifyAccountDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response) {

    const data = await this.authService.verifyAccount(req, res, body);

    // تاني login  المفروض ارجعله توكن عشان ميعملش ريكوست 

    return SuccessResponse({
      message: 'Account Verified successfully.',
      info: "User Credentials Saved In Cookies",
      data
    });

  }


  // ===> Register / Login – Google

  @Post("google")
  async loginWithGoogle(
    @Body() data: LoginWithGoogleDto
  ) {




    return SuccessResponse({
      message: 'Logged In successfully.'
    });


  }




  // ================================ Authentication & Session Management ================================

  // ===> Login By [ Email And Password ]

  @Post('login')
  async login(
    @Req() req: Request,
    @Body() body: SystemLoginDto,
    @Res({ passthrough: true }) res: Response
  ) {

    const data = await this.authService.login(body, res, req);

    return SuccessResponse({
      message: 'Login successfully.',
      info: "User Credentials Saved In Cookies",
      data
    });

  }


  // ===> Refresh Access Token

  @SetMetadata("tokenType", TokenTypeEnum.REFRESH)
  @UseGuards(AuthenticationGuard)
  @Get('refresh-token')
  async refreshToken(
    @Req() req: I_Request,
    @Res({ passthrough: true }) res: Response

  ) {


    await this.authService.refreshToken(
      req.credentials.user!,
      req.cookies.refresh_token,
      req, res)


    return SuccessResponse({
      message: 'Authenticated successfully.',
    });

  }


  // ======================================== Security & Recovery ========================================



}
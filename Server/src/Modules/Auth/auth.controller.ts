import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { VerifyAccountDto } from './dto/verify.account.dto';

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
    return { message: 'User signed up successfully , confirmation OTP sent to your email ' };
  }

  @Post('verify-account')
  async verifyAccount(@Body() body: VerifyAccountDto) {
    await this.authService.verifyAccount(body);

    // تاني login  المفروض ارجعله توكن عشان ميعملش ريكوست 

    return { message: 'Account Verified successfully' };
  }



}
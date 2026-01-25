import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';

@UsePipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
}))
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  signup(
    @Body() body: SignupDto,
  ) {
    return this.authService.signup(body);
  }


}
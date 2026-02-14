import { Module } from '@nestjs/common';
import { EncryptionService } from '../Utils/Security/encryption';
import { EmailService } from '../Utils/Email/email.service';
import { OtpService } from '../Utils/Otp/otp.service';
import { OtpRepository } from 'src/Database/Repository/otp.repository';
import { OTP, OtpSchema } from 'src/Database/Models/otp.model';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from 'src/Database/Repository/user.repository';
import { User, UserSchema } from 'src/Database/Models/user.model';
import { CookiesService } from '../Utils/Cookies/cookies.service';
import { JwtRepository } from 'src/Database/Repository/jwt.repository';
import { Jwt, JwtSchema } from 'src/Database/Models/jwt.model';
import { SecurityLoggerService } from '../Middlewares/security.logger.service';
import { EmailModule } from '../Utils/Email/email.module';
import { MailerService } from '@nestjs-modules/mailer';

@Module({
  imports: [
    EmailModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: OTP.name, schema: OtpSchema },
      { name: Jwt.name, schema: JwtSchema },
    ]),
  ],

  providers: [
    UserRepository,
    EncryptionService,
    EmailService,
    OtpService,
    OtpRepository,
    CookiesService,
    JwtRepository,
    SecurityLoggerService,
  ],

  exports: [
    UserRepository,
    EncryptionService,
    EmailService,
    OtpService,
    OtpRepository,
    MongooseModule,
    CookiesService,
    JwtRepository,
    SecurityLoggerService,
  ],
})
export class CommonModule {}

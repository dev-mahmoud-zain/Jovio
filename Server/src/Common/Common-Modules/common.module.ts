import { Module } from '@nestjs/common';
import { EncryptionService } from '../Utils/Security/encryption';
import { EmailService } from '../Utils/Email/send-email';
import { OtpService } from '../Utils/Otp/otp.service';
import { OtpRepository } from 'src/Database/Repository/otp.repository';
import { OTP, OtpSchema } from 'src/Database/Models/otp.model';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from 'src/Database/Repository/user.repository';
import { User, UserSchema } from 'src/Database/Models/user.model';

@Module({
    imports: [MongooseModule.forFeature([
        { name: User.name, schema: UserSchema },
        { name: OTP.name, schema: OtpSchema }]
    )],

    providers: [UserRepository, EncryptionService, EmailService, OtpService, OtpRepository],

    exports: [UserRepository, EncryptionService, EmailService, OtpService, OtpRepository, MongooseModule],

})
export class CommonModule { }
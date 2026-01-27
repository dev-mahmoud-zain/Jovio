import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenService } from 'src/Common/Utils/Security/token.service';
import { CommonModule } from 'src/Common/Common-Modules/common.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, TokenService],
  imports: [CommonModule],
  exports: [AuthService],
})
export class AuthModule {}
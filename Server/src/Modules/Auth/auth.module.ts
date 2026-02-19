import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CommonModule } from 'src/Common/Common-Modules/common.module';
import { ClientInfoService } from 'src/Common/Utils/Security/client-info.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService,ClientInfoService],
  imports: [CommonModule],
  exports: [AuthService],
})
export class AuthModule {}
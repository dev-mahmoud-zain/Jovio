import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from 'src/Database/Repository/user.repository';
import { TokenService } from 'src/Common/Utils/Security/token.service';
import { CommonModule } from 'src/Common/Common-Modules/common.module';
import { AuthService } from '../Auth/auth.service';
import { AuthModule } from '../Auth/auth.module';
import { ClientInfoService } from 'src/Common/Utils/Security/client-info.service';

@Module({
  imports: [CommonModule, AuthModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserRepository,
    TokenService,
    ClientInfoService,
  ],
  exports: [UsersService],
})
export class UsersModule {}

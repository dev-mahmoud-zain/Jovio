import { Module, Global } from '@nestjs/common';
import { ExceptionFactory } from 'src/common/utils';
import { TokenService } from 'src/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseModule } from './database.module';
import { AppHelpers } from '../helpers/users.helpers';

@Global() 
@Module({
  imports: [DatabaseModule],
  providers: [ExceptionFactory, TokenService, JwtService,AppHelpers],
  exports: [ExceptionFactory, TokenService, JwtService,AppHelpers],
})
export class CommonModule {}

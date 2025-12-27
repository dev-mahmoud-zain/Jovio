// database.module.ts
import { Module } from '@nestjs/common';
import { UserModel, TokenModel } from 'src/DATABASE';
import { UserRepository, TokenRepository } from 'src/DATABASE';

@Module({
  imports: [UserModel, TokenModel],
  providers: [UserRepository, TokenRepository],
  exports: [UserModel, TokenModel, UserRepository, TokenRepository],
})
export class DatabaseModule {}

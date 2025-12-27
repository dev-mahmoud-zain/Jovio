import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersModule } from '../users/users.module';

import { CommonModule, DatabaseModule } from "src/common/modules";

@Module({
  imports:[UsersModule,DatabaseModule,CommonModule],
  exports:[AuthService,],
  controllers:[],
  providers:[AuthService]
})
export class AuthModule{

}
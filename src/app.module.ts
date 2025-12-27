import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { resolve } from 'node:path';
import { AuthController } from './modules/auth';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SuccessResponseInterceptor } from './common/utils/interceptors';
import { UsersModule } from './modules/users/users.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CompanyModule } from './modules/company/company.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: resolve('./config/.env'),
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        uri:
          config.get('NODE_ENV') === 'development'
            ? config.get('LOCAL_DATA_BASE_URL')
            : config.get('CLOUD_DATA_BASE_URL'),
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot()
    ,
    AuthModule,
    UsersModule,
    CompanyModule
  ],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    {
      // To Control Http Status Code
      provide: APP_INTERCEPTOR,
      useClass: SuccessResponseInterceptor,
    },
  ],
})
export class AppModule implements OnModuleInit {
  constructor(@InjectConnection() private connection: Connection) {}

  onModuleInit() {
    if (this.connection.readyState === 1) {
      console.log('🟢 DateBase Connected');
    } else {
      console.log('🔴 DateBase Not Connected');
    }
  }
}
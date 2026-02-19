import { ConfigModule, ConfigService } from '@nestjs/config';

import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './Common/Common-Modules/common.module';
import { LoggerMiddleware } from './Common/Middlewares/logging.middlewares';
import { AuthModule } from './Modules/Auth/auth.module';
import { UsersModule } from './Modules/Users/users.module';
import mailConfig from './Common/Utils/Email/Config/email.config';
import { CompaniesModule } from './Modules/Companies/companies.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    UsersModule,
    CompaniesModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [mailConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URL'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit, NestModule {
  constructor(@InjectConnection() private readonly connection) {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
  async onModuleInit() {
    try {
      await this.connection.db.admin().ping();
      console.log('🟢 DateBase Connected Successfully');
    } catch (error) {
      console.log('🔴 DateBase Not Connected');
    }
  }
}

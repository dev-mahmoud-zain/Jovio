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
import { AuthController } from './Modules/Auth/auth.controller';
import { AuthService } from './Modules/Auth/auth.service';
import { UserRepository } from './Database/Repository/user.repository';
import { User, UserSchema } from './Database/Models/user.model';
import { CommonModule } from './Common/Common-Modules/common.module';
import { LoggerMiddleware } from './Common/Middlewares/logging.middlewares';

@Module({
  imports: [
    
    CommonModule,

    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URL'),
      }),
      inject: [ConfigService],
    }),

  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule implements OnModuleInit, NestModule {
  constructor(@InjectConnection() private readonly connection) { }
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

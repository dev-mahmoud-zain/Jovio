import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './Modules/Auth/auth.controller';
import { AuthService } from './Modules/Auth/auth.service';
import { UserRepository } from './Database/Repository/user.repository';
import { User, UserSchema } from './Database/Models/user.model';

@Module({
  imports: [
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
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ]),
  ],
  controllers: [AppController,AuthController],
  providers: [AppService,AuthService,UserRepository],
})
export class AppModule implements OnModuleInit {
  constructor(@InjectConnection () private readonly connection) {}
  
  async onModuleInit() {
    try {
      await this.connection.db.admin().ping();
      console.log('🟢 DateBase Connected Successfully');
    } catch (error) {
       console.log('🔴 DateBase Not Connected');
    }
  }
}
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import mailConfig from './Config/email.config';
import { EmailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [mailConfig.KEY],
      useFactory: (config: ConfigType<typeof mailConfig>) => {
        return {
          transport: config,
          defaults: {
            from: `"No Reply" <${config.auth.user}>`,
          },
        };
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}

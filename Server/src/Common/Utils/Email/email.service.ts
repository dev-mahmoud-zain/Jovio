import { Injectable } from '@nestjs/common';
import {
  changeEmailTemplate,
  forgetPasswordTemplate,
  verifyAccountTemplate,
} from './email.templates';
import { EmailSubjectEnum } from './email.subjects';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailService: MailerService) {}

  private async sendEmail({
    to,
    subject,
    html,
  }: {
    to: string;
    subject: string;
    html?: string;
  }) {
    try {
      const info = await this.mailService.sendMail({
        from: `"Jovio" <${process.env.APP_EMAIL}>`,
        to,
        subject,
        html,
      });

      return info;
    } catch (error) {
      console.error('Failed to send email', error);
    }
  }

  async verifyAccount({ email, OTPCode }: { email: string; OTPCode: string }) {
    const html = await verifyAccountTemplate({ OTPCode });
    await this.sendEmail({
      to: email,
      subject: EmailSubjectEnum.VERIFY_EMAIL,
      html,
    });
  }

  async forgetPassword({ email, OTPCode }: { email: string; OTPCode: string }) {
    const html = await forgetPasswordTemplate({ OTPCode });
    await this.sendEmail({
      to: email,
      subject: EmailSubjectEnum.FORGET_PASSWORD,
      html,
    });
  }
  async changeEmail({ email, OTPCode }: { email: string; OTPCode: string }) {
    const html = await changeEmailTemplate({ OTPCode });
    this.sendEmail({
      to: email,
      subject: EmailSubjectEnum.CHANGE_EMAIL,
      html,
    });
  }
}

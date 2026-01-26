import nodemailer, { Transporter } from 'nodemailer';

import { Injectable, Logger } from '@nestjs/common';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { verifyAccountTemplate } from './email.templates';
import { EmailSubjectEnum } from './email.subjects';

@Injectable()
export class EmailService {

    private transporter: Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.APP_EMAIL,
                pass: process.env.APP_PASSWORD,
            },
        });
    }

    private async sendEmail({
        to,
        subject,
        html
    }: {
        to: string,
        subject: string,
        html?: string
    }) {
        try {
            const info = await this.transporter.sendMail({
                from: `"Jovio" <${process.env.APP_EMAIL}>`,
                to,
                subject,
                html,
            });

            return info;

        } catch (error) {
            console.error('Failed to send email', error);
            throw error;
        }
    }

    async verifyAccount({
        email,
        OTPCode
    }: {
        email: string,
        OTPCode: string
    }) {
        const html = await verifyAccountTemplate({ OTPCode })
        this.sendEmail({
            to: email,
            subject: EmailSubjectEnum.VERIFY_EMAIL,
            html
        })
    }

}
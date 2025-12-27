import { BadRequestException } from "@nestjs/common";
import { createTransport, Transporter } from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";


export const sendEmail = async (data: Mail.Options): Promise<void> => {

    if (!data.html && data.attachments?.length && !data.text) {
        throw new BadRequestException("Missing Email Content!!");
    }

    const transporter:

        Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>

        = createTransport({
            service: "gmail",
            host: "smtp.gmail.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.APP_EMAIL as string,
                pass: process.env.APP_PASSWORD as string,
            }
        })


    await transporter.sendMail({
        ...data,
        from: `"${process.env.APPLICATION_NAME}" <${process.env.APP_EMAIL}>`,
    });


}
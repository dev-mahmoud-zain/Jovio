import EventEmitter from 'node:events';
import Mail from 'nodemailer/lib/mailer/index.js';

import { confirmCompanyEmailTemplate, confirmEmailTemplate,
       forgetPasswordTemplate,
          passwordChangedTemplate,
           updateEmailTemplate } from './email.template.js';
import { sendEmail } from './send.email.js';
import { InternalServerErrorException } from '@nestjs/common';
import { EmailEventsEnum } from 'src/common/enums';

export const emailEvent = new EventEmitter();

interface IEmailData extends Mail.Options {
    OTP_Code: string
}

interface ICompanyEmailData extends IEmailData {
    companyName:string
}


emailEvent.on(EmailEventsEnum.confirm_Email, async (data: IEmailData) => {
    try {
        data.html = await confirmEmailTemplate({ OTP_Code: data.OTP_Code });
        data.subject = "Confirm Your Email Address";
        await sendEmail(data);

    } catch (error) {
        console.log("Fail To Send Email", error);
        throw new InternalServerErrorException("Something Went Wrong")
    }

})

emailEvent.on(EmailEventsEnum.confirm_Company_Email, async (data: ICompanyEmailData) => {
    try {
        data.html = await confirmCompanyEmailTemplate({ OTP_Code: data.OTP_Code ,companyName:data.companyName });
        data.subject = "Confirm Your Company Email Address";
        await sendEmail(data);

    } catch (error) {
        console.log("Fail To Send Email", error);
        throw new InternalServerErrorException("Something Went Wrong")
    }

})


emailEvent.on(EmailEventsEnum.update_Email, async (data: IEmailData) => {
    try {
        data.html = await updateEmailTemplate({ OTP_Code: data.OTP_Code });
        data.subject = "Confirm Your Updated Email Address";
        await sendEmail(data);
    } catch (error) {
        console.log("Fail To Send Email", error);
        throw new InternalServerErrorException("Something Went Wrong")
    }
})

emailEvent.on(EmailEventsEnum.forget_Password, async (data: IEmailData) => {

    try {
        data.html = await forgetPasswordTemplate({ OTP_Code: data.OTP_Code });
        data.subject = "Forget Your Password?";
        await sendEmail(data);
    } catch (error) {
        console.log("Fail To Send Email", error);
        throw new InternalServerErrorException("Something Went Wrong")
    }

})

emailEvent.on(EmailEventsEnum.change_Password, async (data: IEmailData) => {

    try {
        data.html = await passwordChangedTemplate();
        data.subject = "Forget Your Password?";
        await sendEmail(data);
    } catch (error) {
        console.log("Fail To Send Email", error);
        throw new InternalServerErrorException("Something Went Wrong")
    }

})


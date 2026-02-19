import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  host: process.env.EMAIL_HOST!,
  port: parseInt(process.env.EMAIL_PORT!),
  secure: process.env.NODE_ENV === 'production' || process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.APP_EMAIL!,
    pass: process.env.APP_PASSWORD!,
  },
}));

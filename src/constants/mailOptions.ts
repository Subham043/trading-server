import { FastifyMailOptionsType } from '../@types/mail.type';
import env from '../config/env';

export const mailOptions: FastifyMailOptionsType = {
  defaults: { from: 'John Doe <no-reply@aaaedu.in>' },
  transport: {
    host: env.MAIL_HOST,
    port: env.MAIL_PORT,
    secure: false, // use TLS
    tls: {
      rejectUnauthorized: false,
    },
    auth: {
      user: env.MAIL_USERNAME,
      pass: env.MAIL_PASSWORD,
    },
  },
};

import nodemailer from 'nodemailer';
import { config } from './index';

export const sendEmail = async (to: string, subject: string, text: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.EMAIL,
            pass: config.PASSWORD
        }
    });

    const mailOptions = {
        from: config.EMAIL,
        to,
        subject,
        html: text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);

    return info.response;
}   
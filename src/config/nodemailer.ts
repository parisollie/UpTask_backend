import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
//Vid 536, enviar correo tokens
const config = () => {
    return {
        host: process.env.SMTP_HOST,
        port: +process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
    }
}
//Vid 536
export const transporter = nodemailer.createTransport(config());
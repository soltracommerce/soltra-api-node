import nodemailer from "nodemailer";

interface mailOptions {
  email: string;
  subject: string;
  message: string;
}

const smtpOptions = {
  host: `${process.env.SMTP_HOST}`,
  port: process.env.SMTP_PORT,
  auth: {
    user: `${process.env.SMTP_EMAIL}`,
    pass: `${process.env.SMTP_PASSWORD}`,
  },
};


const sendEMail = async (mailOptions: mailOptions) => {
const transporter = nodemailer.createTransport(smtpOptions as any);

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: mailOptions.email,
    subject: mailOptions.subject,
    text: mailOptions.message,
  };

  const info = await transporter.sendMail(message);
};

export default sendEMail;

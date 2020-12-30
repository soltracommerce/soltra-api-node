import nodemailer from "nodemailer";

interface mailOptions {
  email: string;
  subject: string;
  message: string;
}

const smtpOptions = {
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "3cea73bec94f17",
    pass: "b6fe1163a7904b",
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

  console.log("Message Sent: ", info.messageId);
};

export default sendEMail;

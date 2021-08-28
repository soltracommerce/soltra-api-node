import axios from "axios";
import logger from './../startup/logger';
import colors  from 'colors/safe';

const {
  MAILCHIMP_TRANSACTIONAL_URL,
  MAILCHIMP_TRANSACTIONAL_API_KEY,
  FROM_EMAIL,
} = process.env;

interface Mailinfo {
        subject: string,
        email: string
        parsedTemplate: string
}

class MailchimpTransactional {
  static async send(mailInfo: Mailinfo) {
    const message = {
      from_email: `${FROM_EMAIL}`,
      subject: mailInfo.subject,
      html: mailInfo.parsedTemplate,
      to: [
        {
          email: mailInfo.email,
          type: "to",
        },
      ],
    };

    const body = {
      key: `${MAILCHIMP_TRANSACTIONAL_API_KEY}`,
      message,
    };

    try {
      const { data } = await axios.post(
        `${MAILCHIMP_TRANSACTIONAL_URL}/send`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return data;
    } catch (error) {
      logger.error(colors.red(error.toString()));
    }
  }
}

export default MailchimpTransactional;

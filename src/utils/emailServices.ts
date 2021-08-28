import fs from "fs";
import path from "path";
import MailchimpTransactional from '../apis/mailchimp';

interface EmailTemplate {
  name: string;
  data: {
    [key: string]: string;
  };
}

class MailService {
  static getEmailTemplate(templateName: string): string | null {
    try {
      const file = path.join(__dirname, `../templates/${templateName}`);
      const emailTemplate = fs.readFileSync(file, "utf8");
      return emailTemplate;
    } catch (error) {
      return null;
    }
  }

  static parseEmailTemplate(emailTemplate: EmailTemplate) {
    let template = this.getEmailTemplate(emailTemplate.name);
    if (!template) throw new Error("email template not found");

    Object.keys(emailTemplate.data).forEach((key: string) => {
      const regex = new RegExp(`{{\.\*${key}\.\*}}`, "g");
      template = template!.replace(regex, emailTemplate.data[key]);
    });

    return template;
  }

  static async sendMail(emailTemplate: EmailTemplate, mailData: any) {
    const parsedTemplate = this.parseEmailTemplate(emailTemplate);

    const response = await MailchimpTransactional.send({...mailData, parsedTemplate});

    return response;
  }
}



export default MailService;

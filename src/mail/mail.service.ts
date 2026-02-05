import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendMail(
    to: string,
    subject: string,
    templateName: string,
    context: any,
    attachments: any[] = [],
  ) {
    try {
      const layoutPath = path.join(
        process.cwd(),
        'src',
        'mail',
        'templates',
        'layouts',
        'main.hbs',
      );

      const layoutSource = fs.readFileSync(layoutPath, 'utf-8');
      const layoutTemplate = handlebars.compile(layoutSource);

      const templatePath = path.join(
        process.cwd(),
        'src',
        'mail',
        'templates',
        `${templateName}.hbs`,
      );

      const templateSource = fs.readFileSync(templatePath, 'utf-8');
      const contentTemplate = handlebars.compile(templateSource);

      const body=contentTemplate(context);
      const html = layoutTemplate({ body });

      return await this.transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject,
        html,
        attachments,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to send email');
    }
  }
}

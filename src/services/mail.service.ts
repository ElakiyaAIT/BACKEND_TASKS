import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import { Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config/dist/config.service';

@Injectable()
export class MailService {
  private transporter:Transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.getOrThrow<string>('mail.host'),
      port: this.config.getOrThrow<number>('mail.port'),
      secure: this.config.get<boolean>('mail.secure') || false,
      auth: {
        user: this.config.getOrThrow<string>('mail.user'),
        pass: this.config.getOrThrow<string>('mail.pass'),
      },
    });
  }

  async sendMail(
    to: string,
    subject: string,
    templateName: string,
    context: Record<string, unknown>,
    attachments: nodemailer.Attachment[] = [],
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

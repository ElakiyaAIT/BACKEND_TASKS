import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import nodemailer, { Transporter } from 'nodemailer';
import type { SentMessageInfo, SendMailOptions } from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import { ConfigService } from '@nestjs/config/dist/config.service';

@Injectable()
export class MailService {
  private transporter: Transporter;

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
    attachments: SendMailOptions['attachments'] = [],
  ): Promise<SentMessageInfo> {
    try {
      const layoutPath = path.join(
        process.cwd(),
        'src',
        'mail',
        'templates',
        'layouts',
        'main.hbs',
      );
      console.log({
        to,
        subject,
        templateName,
        context,
        attachments,
      });

      if (!templateName) {
        throw new BadRequestException('Template name is required');
      }

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

      const body = contentTemplate(context);
      const html = layoutTemplate({ body });

      return await this.transporter.sendMail({
        from: this.config.getOrThrow<string>('mail.from'),
        to,
        subject,
        html,
        attachments,
      });
    } catch (error) {
      console.error('MAIL ERROR:', error);
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Failed to send email',
      );
    }
  }
}

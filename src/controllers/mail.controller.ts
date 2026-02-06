import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from '../services/mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  async sendMail(@Body() body: any) {
    return this.mailService.sendMail(
      body.to,
      body.subject,
      body.template,
      body.context,
      body.attachments,
    );
  }
}

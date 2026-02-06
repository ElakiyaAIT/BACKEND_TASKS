import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from '../services/mail.service';
import { SendMailDto } from 'src/dtos/send-mail.dto';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  async sendMail(@Body() body: SendMailDto): Promise<{ message: string }> {
    await this.mailService.sendMail(
      body.to,
      body.subject,
      body.template,
      body.context,
      body.attachments,
    );

    return { message: 'Email sent successfully' };
  }
}

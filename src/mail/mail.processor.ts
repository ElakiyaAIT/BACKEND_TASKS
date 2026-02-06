import { Processor, Process } from '@nestjs/bull';
import type { Job } from 'bull';
import { MailService } from '../services/mail.service';

@Processor('mail-queue')
export class MailProcessor {
  constructor(private readonly mailService: MailService) {}

  @Process('send-welcome-mail')
  async handleWelcomeMail(job: Job) {
    const { to, name } = job.data;

    console.log('Sending welcome mail to:', to);

    await this.mailService.sendMail(
      to,
      'Welcome to Our Platform 🎉',
      'welcome', 
      { name },
    );

    console.log('Welcome mail sent successfully');
  }
}

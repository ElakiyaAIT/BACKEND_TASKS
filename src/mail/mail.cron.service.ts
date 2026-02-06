import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

@Injectable()
export class MailCronService {
  constructor(
    @InjectQueue('mail-queue')
    private readonly mailQueue: Queue,
  ) {}

  // Runs every day at 6:35 AM
  @Cron('34 18 * * *')
  async sendWelcomeMailAt635() {
    await this.mailQueue.add('send-welcome-mail', {
      to: 'elakiyavarshiniait@gmail.com', // can be ANY email
      name: 'Elakiya',
    });

    console.log('Welcome mail job added at 6:35 PM');
  }
}

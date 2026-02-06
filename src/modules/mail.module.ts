import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from '../services/mail.service';
import { MailController } from '../controllers/mail.controller';
import { BullModule } from '@nestjs/bull';
import { MailProcessor } from '../mail/mail.processor';
import { MailCronService } from '../mail/mail.cron.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes env variables available everywhere
    }),
    BullModule.registerQueue({
      name: 'mail-queue', // name of the queue
    }),
  ],
  controllers: [MailController],
  providers: [MailService, MailProcessor, MailCronService],
  exports: [MailService],
})
export class MailModule {}

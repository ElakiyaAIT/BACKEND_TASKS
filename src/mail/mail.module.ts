import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes env variables available everywhere
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService], // 🔥 allows other modules to send mail
})
export class MailModule {}

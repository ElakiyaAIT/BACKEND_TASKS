import {
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import type { Attachment } from 'nodemailer/lib/mailer';

export class SendMailDto {
  @IsEmail()
  to: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  template: string;

  @IsObject()
  context: Record<string, unknown>;

  @IsOptional()
  attachments?: Attachment[];
}

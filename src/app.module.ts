import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth.module';
import { ProfileModule } from './modules/profile.module';
import { ProductsModule } from './modules/products.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { MailModule } from './modules/mail.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './cron/cron.module';
import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users.module';
import * as yaml from 'js-yaml';
import * as fs from 'fs';

function loadConfig() {
  const env = process.env.NODE_ENV || 'development';

  const fileName =
    env === 'production'
      ? 'prod.yaml'
      : env === 'staging'
      ? 'stage.yaml'
      : 'dev.yaml';

  const filePath = join(process.cwd(), 'config', fileName);

  return yaml.load(
    fs.readFileSync(filePath, 'utf8'),
  ) as Record<string, any>;
}

@Module({
  imports: [
      MongooseModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    uri: config.getOrThrow<string>('database.mongoUri'),
  }),
}),
    AuthModule,
    ProfileModule,
    ProductsModule,
    MailModule,
    UsersModule,
     ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ScheduleModule.forRoot(),
    CronModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [loadConfig],
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

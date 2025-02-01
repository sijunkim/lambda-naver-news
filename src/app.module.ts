import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { NewsModule } from './news/news.module';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [ConfigModule.forRoot(), InfrastructureModule, WebhookModule],
  providers: [AppService],
})
export class AppModule {}

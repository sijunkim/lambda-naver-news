import { Module } from '@nestjs/common';
import { SlackService } from './slack.service';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [SlackService],
  exports: [SlackService],
})
export class WebhookModule {}

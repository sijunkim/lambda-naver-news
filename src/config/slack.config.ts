import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigInterface } from '../common/interfaces/config.interface';
import { SlackInterface } from '../common/interfaces/slack.interface';

@Injectable()
export class SlackConfig implements ConfigInterface<SlackInterface> {
  constructor(private readonly configService: ConfigService) {}

  getConfig(): SlackInterface {
    return {
      breakingNewsWebhookUrl: this.configService.get('BREAKING_NEWS_WEBHOOK_URL') || '',
      exclusiveNewsWebhookUrl: this.configService.get('EXCLUSIVE_NEWS_WEBHOOK_URL') || '',
      developWebhookUrl: this.configService.get('DEVELOP_WEBHOOK_URL') || '',
    };
  }

  validateConfig(): void {
    const requiredEnvVars = ['BREAKING_NEWS_WEBHOOK_URL', 'EXCLUSIVE_NEWS_WEBHOOK_URL', 'DEVELOP_WEBHOOK_URL'];
    const missingVars = requiredEnvVars.filter((varName) => !this.configService.get(varName));

    if (missingVars.length > 0) {
      throw new Error(`Missing required Slack environment variables: ${missingVars.join(', ')}`);
    }
  }
}

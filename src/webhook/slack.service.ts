import { Injectable } from '@nestjs/common';
import { IncomingWebhook, IncomingWebhookSendArguments } from '@slack/webhook';
import { SlackInterface } from 'src/common/interfaces/slack.interface';
import { SlackConfig } from 'src/config/slack.config';
@Injectable()
export class SlackService {
  private slackConfig: SlackInterface;

  constructor(configService: SlackConfig) {
    this.slackConfig = configService.getConfig();
  }

  getHello(): string {
    return 'Hello World!';
  }

  /**
   * 뉴스 발송
   */
  async newsSend() {
    const webhook = new IncomingWebhook(this.slackConfig.developWebhookUrl);
    await webhook.send('TEST');
  }
}

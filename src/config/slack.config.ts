import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SlackConfig {
  constructor(private readonly configService: ConfigService) {}
}

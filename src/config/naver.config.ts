import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NaverConfig {
  constructor(private readonly configService: ConfigService) {}
}

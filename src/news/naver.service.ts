import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NaverService {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly openApiUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.clientId = this.configService.get<string>('NAVER_CLIENT_ID') || '';
    this.clientSecret = this.configService.get<string>('NAVER_CLIENT_SECRET') || '';
    this.openApiUrl = this.configService.get<string>('NAVER_OPENAPI_URL') || '';
  }
}

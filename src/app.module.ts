import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { NewsModule } from './news/news.module';

@Module({
  imports: [ConfigModule.forRoot(), InfrastructureModule],
  providers: [AppService],
})
export class AppModule {}

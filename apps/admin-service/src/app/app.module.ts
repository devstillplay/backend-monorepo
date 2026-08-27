import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { PrismaModule } from '@my-workspace/prisma';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MarketingModule } from './marketing/marketing.module';

const envPaths =
  process.env.RENDER === 'true'
    ? []
    : [
        '.env',
        join(process.cwd(), '.env'),
        join(process.cwd(), '..', '.env'),
        join(process.cwd(), '..', '..', '.env'),
        join(process.cwd(), '..', '..', '..', '.env'),
      ];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: envPaths }),
    PrismaModule,
    MarketingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

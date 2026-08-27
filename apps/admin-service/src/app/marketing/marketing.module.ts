import { Module } from '@nestjs/common';
import { MarketingEmailService } from './marketing-email.service';
import { MarketingService } from './marketing.service';

@Module({
  providers: [MarketingEmailService, MarketingService],
  exports: [MarketingService],
})
export class MarketingModule {}

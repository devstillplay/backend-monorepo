import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { ZoomService } from './zoom.service';

@Module({
  providers: [EventsService, ZoomService],
  exports: [EventsService],
})
export class EventsModule {}

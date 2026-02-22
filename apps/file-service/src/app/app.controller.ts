import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import type { UploadPayload } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('file-upload')
  async upload(@Payload() payload: UploadPayload) {
    return this.appService.upload(payload);
  }
}

import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { rethrowAdminMicroserviceError } from '../utils/microservice-error';

@Controller('waitlist')
export class WaitlistController {
  constructor(
    @Inject('ADMIN_SERVICE') private readonly adminClient: ClientProxy
  ) {}

  @Post()
  async join(@Body() body: unknown) {
    try {
      return await firstValueFrom(
        this.adminClient.send('waitlist-create', body)
      );
    } catch (err) {
      rethrowAdminMicroserviceError(err);
    }
  }
}

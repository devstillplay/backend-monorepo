import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { rethrowAdminMicroserviceError } from '../utils/microservice-error';

@Controller('events')
export class EventsController {
  constructor(
    @Inject('ADMIN_SERVICE') private readonly adminClient: ClientProxy
  ) {}

  @Get('featured')
  async featured() {
    try {
      return await firstValueFrom(this.adminClient.send('event-public-featured', {}));
    } catch (err) {
      rethrowAdminMicroserviceError(err);
    }
  }

  @Get(':slug')
  async getBySlug(@Param('slug') slug: string) {
    try {
      return await firstValueFrom(this.adminClient.send('event-public-get', { slug }));
    } catch (err) {
      rethrowAdminMicroserviceError(err);
    }
  }

  @Post(':slug/register')
  async register(
    @Param('slug') slug: string,
    @Body() body: Record<string, unknown>
  ) {
    try {
      return await firstValueFrom(
        this.adminClient.send('event-register', {
          fullName: body?.fullName,
          email: body?.email,
          occupation: body?.occupation,
          eventSlug: slug,
        })
      );
    } catch (err) {
      rethrowAdminMicroserviceError(err);
    }
  }
}

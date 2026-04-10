import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('waitlist')
export class WaitlistController {
  constructor(
    @Inject('ADMIN_SERVICE') private readonly adminClient: ClientProxy
  ) {}

  @Post()
  join(@Body() body: unknown) {
    return firstValueFrom(this.adminClient.send('waitlist-create', body));
  }
}

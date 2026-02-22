import { Controller, Get, Inject, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth/auth.guard';
import type { RequestWithUser } from '../types/request.types';

import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('user')
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async getProfile(@Req() req: RequestWithUser) {
    return firstValueFrom(
      this.userClient.send('get-user-profile', req.user.id)
    );
  }
}

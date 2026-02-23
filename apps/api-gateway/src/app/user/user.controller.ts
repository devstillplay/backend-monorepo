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

  /** Get all users (no auth) */
  @Get('all')
  async getAllUsers() {
    return firstValueFrom(this.userClient.send('get-all-users', {}));
  }

  @UseGuards(AuthGuard)
  @Get()
  async getProfile(@Req() req: RequestWithUser) {
    return firstValueFrom(
      this.userClient.send('get-user-profile', req.user.id)
    );
  }
}

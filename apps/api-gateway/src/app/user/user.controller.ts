import { Controller, Get, Inject, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth/auth.guard';
import type { RequestWithUser } from '../types/request.types';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { throwIfServiceUnavailable } from '../utils/microservice-error';

@Controller('user')
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy
  ) {}

  /** Get all users (no auth). Requires user-service running on TCP 8878 (or USER_SERVICE_PORT). */
  @Get('all')
  async getAllUsers() {
    try {
      return await firstValueFrom(this.userClient.send('get-all-users', {}));
    } catch (err) {
      throwIfServiceUnavailable(err, 'User');
      throw err;
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  async getProfile(@Req() req: RequestWithUser) {
    return firstValueFrom(
      this.userClient.send('get-user-profile', req.user.id)
    );
  }
}

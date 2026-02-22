import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { LoginDto } from './dto/login.dto';

export const AUTH_SERVICE = 'AUTH_SERVICE';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy
  ) {}

  async login(loginDto: LoginDto) {
    return firstValueFrom(
      this.authClient.send('auth-login', loginDto)
    );
  }
}

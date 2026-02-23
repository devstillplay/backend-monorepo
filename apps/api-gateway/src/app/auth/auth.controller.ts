import {
  Body,
  ConflictException,
  Controller,
  HttpException,
  Inject,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { throwIfServiceUnavailable } from '../utils/microservice-error';
import { AUTH_SERVICE } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

function handleAuthError(err: unknown): never {
  throwIfServiceUnavailable(err, 'Auth');
  const o = err && typeof err === 'object' ? (err as Record<string, unknown>) : {};
  const payload = (o.error ?? o.response ?? o) as Record<string, unknown> | undefined;
  const statusCode = Number(
    o.statusCode ?? payload?.statusCode ?? payload?.status ?? 500
  );
  let message: string =
    typeof o.message === 'string'
      ? o.message
      : typeof payload?.message === 'string'
        ? payload.message
        : err instanceof Error
          ? err.message
          : 'Internal server error';
  if (Array.isArray(message)) message = message[0] as string;
  if (typeof message !== 'string' || !message.trim()) message = 'Internal server error';
  if (statusCode === 401) throw new UnauthorizedException(message);
  if (statusCode === 409) throw new ConflictException(message);
  throw new HttpException(message, statusCode >= 400 && statusCode < 600 ? statusCode : 500);
}

@Controller('auth')
export class AuthController {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      return await firstValueFrom(this.authClient.send('auth-login', loginDto));
    } catch (err) {
      handleAuthError(err);
    }
  }

  /** Step 1: send 4-digit code to user email (requires email + password) */
  @Post('request-login-code')
  async requestLoginCode(
    @Body() body: { email: string; password: string },
  ) {
    try {
      return await firstValueFrom(
        this.authClient.send('auth-request-login-code', body),
      );
    } catch (err) {
      handleAuthError(err);
    }
  }

  /** Step 2: verify code and return JWT */
  @Post('verify-login-code')
  async verifyLoginCode(
    @Body() body: { email: string; code: string },
  ) {
    try {
      return await firstValueFrom(
        this.authClient.send('auth-verify-login-code', body),
      );
    } catch (err) {
      handleAuthError(err);
    }
  }

  /** Request code: type 'login' | 'register'. Register requires firstName, lastName, nin (and optional picture). */
  @Post('request-code')
  async requestCode(
    @Body()
    body: {
      type: 'login' | 'register';
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
      nin?: string;
      picture?: string;
    },
  ) {
    try {
      return await firstValueFrom(
        this.authClient.send('auth-request-code', body),
      );
    } catch (err) {
      handleAuthError(err);
    }
  }

  /** Verify code: type 'login' | 'register'. For register, creates user + wallet then returns token. */
  @Post('verify-code')
  async verifyCode(
    @Body() body: { type: 'login' | 'register'; email: string; code: string },
  ) {
    try {
      return await firstValueFrom(
        this.authClient.send('auth-verify-code', body),
      );
    } catch (err) {
      handleAuthError(err);
    }
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      return await firstValueFrom(
        this.authClient.send('auth-register', registerDto)
      );
    } catch (err) {
      handleAuthError(err);
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    try {
      return await firstValueFrom(
        this.authClient.send('auth-forgot-password', body),
      );
    } catch (err) {
      handleAuthError(err);
    }
  }

  @Post('reset-password')
  async resetPassword(
    @Body() body: { resetToken?: string; email?: string; code: string; newPassword: string },
  ) {
    try {
      return await firstValueFrom(
        this.authClient.send('auth-reset-password', body),
      );
    } catch (err) {
      handleAuthError(err);
    }
  }
}

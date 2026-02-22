import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AUTH_SERVICE } from '../../auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}
  async canActivate(
    context: ExecutionContext
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Token is required');
    }
    try {
      const token = authHeader.split(' ')[1];
      const decoded = await firstValueFrom(
        this.authClient.send('validate-token', token)
      );
      if (!decoded?.valid) {
        throw new UnauthorizedException('Invalid token');
      }
      request.user = {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        verified: decoded.verified,
      };
      return true;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Invalid token';
      throw new UnauthorizedException('Invalid token: ' + message);
    }
  }
}

import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RequestCodeDto } from './dto/request-code.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('auth-login')
  async login(@Payload() payload: LoginDto) {
    return await this.appService.login(payload);
  }

  @MessagePattern('auth-request-login-code')
  async handleRequestLoginCode(@Payload() payload: { email: string; password: string }) {
    return await this.appService.requestLoginCode(payload);
  }

  @MessagePattern('auth-verify-login-code')
  async handleVerifyLoginCode(@Payload() payload: { email: string; code: string }) {
    return await this.appService.verifyLoginCode(payload);
  }

  /** Single flow: type 'login' | 'register' in body */
  @MessagePattern('auth-request-code')
  async handleRequestCode(@Payload() payload: RequestCodeDto) {
    return await this.appService.requestCode(payload);
  }

  @MessagePattern('auth-verify-code')
  async handleVerifyCode(@Payload() payload: VerifyCodeDto) {
    return await this.appService.verifyCode(payload);
  }

  @MessagePattern('validate-token')
  async validateToken(@Payload() payload: string) {
    return await this.appService.validateToken(payload);
  }

  @MessagePattern('auth-register')
  async register(@Payload() payload: RegisterDto) {
    return await this.appService.register(payload);
  }

  @MessagePattern('auth-forgot-password')
  async requestPasswordReset(@Payload() payload: { email: string }) {
    return await this.appService.requestPasswordReset(payload);
  }

  @MessagePattern('auth-reset-password')
  async resetPassword(
    @Payload()
    payload: {
      resetToken?: string;
      email?: string;
      code: string;
      newPassword: string;
    },
  ) {
    return await this.appService.resetPassword(payload);
  }
}

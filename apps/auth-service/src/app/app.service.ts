import {
  ConflictException,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
// eslint-disable-next-line @nx/enforce-module-boundaries -- Prisma generated types
import type { Prisma } from '../../../../libs/prisma/generated';
import { PrismaService, generateSpNumber } from '@my-workspace/prisma';
import { Role } from './enums/role.enum';
import { LoginDto } from './dto/login.dto';
import { LoginResponse, User } from './types/user.types';
import { RegisterDto } from './dto/register.dto';
import { RequestCodeDto } from './dto/request-code.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { EmailService } from './email/email.service';

const SALT_ROUNDS = 10;
const CODE_EXPIRY_MINUTES = 10;

function generate4DigitCode(): string {
  const n = Math.floor(Math.random() * 10000);
  return n.toString().padStart(4, '0');
}

@Injectable()
export class AppService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    if (!loginDto?.email || !loginDto?.password) {
      throw new UnauthorizedException('Invalid email or password');
    }
    let user;
    try {
      user = await this.prisma.user.findUnique({
        where: { email: loginDto.email },
      });
    } catch (_err) {
      throw new ServiceUnavailableException('Service temporarily unavailable. Please try again.');
    }
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    if (user.suspended) {
      throw new UnauthorizedException('Account suspended. Please contact support.');
    }
    const token = this.jwtService.sign({
      userId: user.id,
      role: user.role,
      email: user.email,
      verified: user.verified,
    });
    return {
      message: 'Login successful',
      token,
    };
  }

  /** Step 1: verify email+password. Super Admin: return token and skip OTP. Others: send 4-digit code. */
  async requestLoginCode(payload: {
    email: string;
    password: string;
  }): Promise<
    | { message: string }
    | { message: string; token: string; user: { id: string; email: string; role: string; firstName?: string; lastName?: string } }
  > {
    const { email, password } = payload ?? {};
    if (!email?.trim() || !password) {
      throw new UnauthorizedException('Invalid email or password');
    }
    let user;
    try {
      user = await this.prisma.user.findUnique({
        where: { email: email.trim().toLowerCase() },
      });
    } catch (_err) {
      throw new ServiceUnavailableException('Service temporarily unavailable. Please try again.');
    }
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    if (user.suspended) {
      throw new UnauthorizedException('Account suspended. Please contact support.');
    }
    const isSuperAdmin = user.role === Role.SuperAdmin;
    if (isSuperAdmin) {
      const token = this.jwtService.sign({
        userId: user.id,
        role: user.role,
        email: user.email,
        verified: user.verified,
      });
      return {
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      };
    }
    const code = generate4DigitCode();
    const expiresAt = new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000);
    await this.prisma.loginCode.deleteMany({ where: { email: user.email } });
    await this.prisma.loginCode.create({
      data: { email: user.email, code, expiresAt },
    });
    await this.emailService.sendLoginCode(user.email, code);
    return { message: 'Verification code sent to your email' };
  }

  /**
   * Single entry: request code. type 'login' = send code for existing user (or token for Super Admin); type 'register' = store pending + send code.
   */
  async requestCode(
    payload: RequestCodeDto,
  ): Promise<
    | { message: string }
    | { message: string; token: string; user: { id: string; email: string; role: string; firstName?: string; lastName?: string } }
  > {
    const type = payload?.type;
    const email = payload?.email?.trim()?.toLowerCase();
    const password = payload?.password;

    if (!email || !password) {
      throw new UnauthorizedException('Email and password are required');
    }
    if (type === 'login') {
      return this.requestLoginCode({ email, password });
    }
    if (type === 'register') {
      const { firstName, lastName, nin, picture } = payload;
      if (!firstName?.trim() || !lastName?.trim() || !nin?.trim()) {
        throw new UnauthorizedException('firstName, lastName and nin are required for registration');
      }
      let existingByEmail: { id: string } | null = null;
      let existingByNin: { id: string } | null = null;
      try {
        [existingByEmail, existingByNin] = await Promise.all([
          this.prisma.user.findUnique({ where: { email }, select: { id: true } }),
          this.prisma.user.findUnique({ where: { nin: nin.trim() }, select: { id: true } }),
        ]);
      } catch (_err) {
        throw new ServiceUnavailableException('Service temporarily unavailable. Please try again.');
      }
      if (existingByEmail) {
        throw new ConflictException('User with this email already exists');
      }
      if (existingByNin) {
        throw new ConflictException('User with this NIN already registered');
      }
      const code = generate4DigitCode();
      const expiresAt = new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000);
      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
      try {
        await this.prisma.pendingRegistration.deleteMany({ where: { email } });
        await this.prisma.pendingRegistration.create({
          data: {
            email,
            code,
            expiresAt,
            passwordHash,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            nin: nin.trim(),
            picture: picture?.trim() || null,
          },
        });
      } catch (_err) {
        throw new ServiceUnavailableException('Service temporarily unavailable. Please try again.');
      }
      await this.emailService.sendLoginCode(email, code);
      return { message: 'Verification code sent to your email' };
    }
    throw new UnauthorizedException('type must be "login" or "register"');
  }

  /**
   * Single entry: verify code. type 'login' = issue JWT for existing user; type 'register' = create user + wallet, then issue JWT.
   */
  async verifyCode(payload: VerifyCodeDto): Promise<LoginResponse> {
    const type = payload?.type;
    const email = payload?.email?.trim()?.toLowerCase();
    const code = payload?.code?.trim();

    if (!email || !code) {
      throw new UnauthorizedException('Email and code are required');
    }
    if (type === 'login') {
      return this.verifyLoginCode({ email, code });
    }
    if (type === 'register') {
      let pending;
      try {
        pending = await this.prisma.pendingRegistration.findFirst({
          where: { email },
          orderBy: { createdAt: 'desc' },
        });
      } catch (_err) {
        throw new ServiceUnavailableException('Service temporarily unavailable. Please try again.');
      }
      if (!pending || pending.code !== code) {
        throw new UnauthorizedException('Invalid or expired code');
      }
      if (new Date() > pending.expiresAt) {
        await this.prisma.pendingRegistration.deleteMany({ where: { email } });
        throw new UnauthorizedException('Code expired. Please request a new one.');
      }
      let userNumber: string | undefined;
      for (let attempt = 0; attempt < 10; attempt++) {
        const candidate = generateSpNumber();
        const existingNum = await this.prisma.user.findUnique({
          where: { userNumber: candidate },
        });
        if (!existingNum) {
          userNumber = candidate;
          break;
        }
      }
      if (!userNumber) {
        throw new ConflictException('Could not generate user number');
      }
      try {
        const user = await this.prisma.user.create({
          data: {
            userNumber,
            email: pending.email,
            password: pending.passwordHash,
            firstName: pending.firstName,
            lastName: pending.lastName,
            nin: pending.nin,
            picture: pending.picture,
            role: Role.Customer,
          },
        });
        await this.prisma.wallet.create({
          data: { userId: user.id, balance: 0, currency: 'NGN' },
        });
        await this.prisma.pendingRegistration.deleteMany({ where: { email } });
        const token = this.jwtService.sign({
          userId: user.id,
          role: user.role,
          email: user.email,
          verified: user.verified,
        });
        return {
          message: 'Registration successful',
          token,
        };
      } catch (err: unknown) {
        const prismaErr = err as { code?: string };
        if (prismaErr?.code === 'P2002') {
          throw new ConflictException('Email or NIN already in use. Please try again.');
        }
        throw new ServiceUnavailableException('Service temporarily unavailable. Please try again.');
      }
    }
    throw new UnauthorizedException('type must be "login" or "register"');
  }

  /** Step 2: verify 4-digit code, then issue JWT */
  async verifyLoginCode(payload: { email: string; code: string }): Promise<LoginResponse> {
    const { email, code } = payload ?? {};
    if (!email?.trim() || !code?.trim()) {
      throw new UnauthorizedException('Email and code are required');
    }
    const normalizedEmail = email.trim().toLowerCase();
    const record = await this.prisma.loginCode.findFirst({
      where: { email: normalizedEmail },
      orderBy: { createdAt: 'desc' },
    });
    if (!record || record.code !== code.trim()) {
      throw new UnauthorizedException('Invalid or expired code');
    }
    if (new Date() > record.expiresAt) {
      await this.prisma.loginCode.deleteMany({ where: { email: normalizedEmail } });
      throw new UnauthorizedException('Code expired. Please request a new one.');
    }
    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (user.suspended) {
      await this.prisma.loginCode.deleteMany({ where: { email: normalizedEmail } });
      throw new UnauthorizedException('Account suspended. Please contact support.');
    }
    await this.prisma.loginCode.deleteMany({ where: { email: normalizedEmail } });
    const token = this.jwtService.sign({
      userId: user.id,
      role: user.role,
      email: user.email,
      verified: user.verified,
    });
    return {
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role as Role,
        firstName: user.firstName,
        lastName: user.lastName,
        picture: user.picture ?? undefined,
      } as User,
    };
  }

  async validateToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      return {
        valid: true,
        userId: decoded.userId,
        role: decoded.role,
        email: decoded.email,
        verified: decoded.verified,
        expiresIn: decoded.expiresIn,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Invalid token';
      throw new UnauthorizedException('Invalid token: ' + message);
    }
  }

  /** Forgot password: send 4-digit reset code to email if user exists. Returns resetToken for client to send back with code. */
  async requestPasswordReset(payload: {
    email: string;
  }): Promise<{ message: string; resetToken?: string }> {
    const email = payload?.email?.trim()?.toLowerCase();
    if (!email) {
      throw new UnauthorizedException('Email is required');
    }
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    });
    if (!user) {
      return { message: 'If an account exists for this email, you will receive a reset code shortly.' };
    }
    const code = generate4DigitCode();
    const resetToken = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000);
    await this.prisma.passwordResetCode.deleteMany({ where: { email: user.email } });
    await this.prisma.passwordResetCode.create({
      data: {
        email: user.email,
        token: resetToken,
        code,
        expiresAt,
      } as Prisma.PasswordResetCodeCreateInput,
    });
    await this.emailService.sendPasswordResetCode(user.email, code);
    return {
      message: 'If an account exists for this email, you will receive a reset code shortly.',
      resetToken,
    };
  }

  /** Reset password: validate by resetToken + code (from forgot-password), then set new password. */
  async resetPassword(payload: {
    resetToken?: string;
    email?: string;
    code: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    const resetToken = payload?.resetToken?.trim();
    const email = payload?.email?.trim()?.toLowerCase();
    const code = payload?.code?.trim();
    const newPassword = payload?.newPassword;
    if (!code || !newPassword || newPassword.length < 6) {
      throw new UnauthorizedException('Code and new password (min 6 characters) are required');
    }
    let record: { email: string; code: string; expiresAt: Date } | null = null;
    if (resetToken) {
      record = await this.prisma.passwordResetCode.findUnique({
        where: { token: resetToken } as unknown as Prisma.PasswordResetCodeWhereUniqueInput,
      });
    }
    if (!record && email) {
      record = await this.prisma.passwordResetCode.findFirst({
        where: { email },
        orderBy: { createdAt: 'desc' },
      });
    }
    if (!record || record.code !== code) {
      throw new UnauthorizedException('Invalid or expired reset code');
    }
    if (new Date() > record.expiresAt) {
      if (record.email) {
        await this.prisma.passwordResetCode.deleteMany({ where: { email: record.email } });
      }
      throw new UnauthorizedException('Reset code expired. Please request a new one.');
    }
    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await this.prisma.user.update({
      where: { email: record.email },
      data: { password: passwordHash },
    });
    await this.prisma.passwordResetCode.deleteMany({ where: { email: record.email } });
    return { message: 'Password reset successful. You can now log in.' };
  }

  async register(registerDto: RegisterDto) {
    const [existingByEmail, existingByNin] = await Promise.all([
      this.prisma.user.findUnique({ where: { email: registerDto.email } }),
      this.prisma.user.findUnique({ where: { nin: registerDto.nin } }),
    ]);
    if (existingByEmail) {
      throw new ConflictException('User with this email already exists');
    }
    if (existingByNin) {
      throw new ConflictException('User with this NIN already registered');
    }
    let userNumber: string | undefined;
    for (let attempt = 0; attempt < 10; attempt++) {
      const candidate = generateSpNumber();
      const existingNum = await this.prisma.user.findUnique({
        where: { userNumber: candidate },
      });
      if (!existingNum) {
        userNumber = candidate;
        break;
      }
    }
    if (!userNumber) {
      throw new ConflictException('Could not generate user number');
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, SALT_ROUNDS);
    const user = await this.prisma.user.create({
      data: {
        userNumber,
        email: registerDto.email,
        password: hashedPassword,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        nin: registerDto.nin,
        picture: registerDto.picture ?? null,
        role: Role.Customer,
      },
    });
    await this.prisma.wallet.create({
      data: { userId: user.id, balance: 0, currency: 'NGN' },
    });
    return {
      message: 'Register successful',
      user: {
        id: user.id,
        userNumber: user.userNumber,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  // refreshToken(token: string) {
  //   return this.jwtService.refreshToken(token);
  // }

  // logout(token: string) {
  //   return this.jwtService.logout(token);
  // }
}

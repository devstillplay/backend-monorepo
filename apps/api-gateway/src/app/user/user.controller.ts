import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from '@my-workspace/prisma';
import { AuthGuard } from '../guards/auth/auth.guard';
import type { RequestWithUser } from '../types/request.types';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { throwIfServiceUnavailable } from '../utils/microservice-error';

function profileResponseUser(user: {
  id: string;
  userNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string | null;
  nin: string;
  ninSlip: string | null;
  role: string;
  verified: boolean;
  createdAt: Date;
}) {
  return {
    id: user.id,
    accountType: 'customer' as const,
    userNumber: user.userNumber,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    picture: user.picture,
    nin: user.nin,
    ninSlip: user.ninSlip,
    role: user.role,
    verified: user.verified,
    createdAt: user.createdAt,
  };
}

function profileResponseStaff(employee: {
  id: string;
  employeeNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  active: boolean;
  createdAt: Date;
}) {
  return {
    id: employee.id,
    accountType: 'staff' as const,
    userNumber: employee.employeeNumber,
    employeeNumber: employee.employeeNumber,
    email: employee.email,
    firstName: employee.firstName,
    lastName: employee.lastName,
    picture: null as string | null,
    nin: null as string | null,
    ninSlip: null as string | null,
    role: employee.role,
    verified: true,
    active: employee.active,
    createdAt: employee.createdAt,
  };
}

@Controller('user')
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    private readonly prisma: PrismaService,
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

  /**
   * Authenticated profile — read directly from the DB so the app works when user-service
   * is not running (same MongoDB URL as Prisma in api-gateway).
   */
  @UseGuards(AuthGuard)
  @Get()
  async getProfile(@Req() req: RequestWithUser) {
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.id },
    });
    if (user) {
      return {
        message: 'User profile',
        user: profileResponseUser(user),
      };
    }
    const employee = await this.prisma.employee.findUnique({
      where: { id: req.user.id },
    });
    if (employee) {
      return {
        message: 'User profile',
        user: profileResponseStaff(employee),
      };
    }
    throw new NotFoundException('User not found');
  }

  /** Update profile fields (e.g. `picture` = Cloudinary secure URL from POST /files/upload). */
  @UseGuards(AuthGuard)
  @Patch()
  async updateProfile(
    @Req() req: RequestWithUser,
    @Body() body: { picture?: string },
  ) {
    const picture = body?.picture?.trim();
    if (!picture) {
      throw new BadRequestException('picture is required (Cloudinary URL string)');
    }
    const staff = await this.prisma.employee.findUnique({
      where: { id: req.user.id },
      select: { id: true },
    });
    if (staff) {
      throw new BadRequestException(
        'Staff accounts cannot update profile photos via this endpoint.'
      );
    }
    try {
      const user = await this.prisma.user.update({
        where: { id: req.user.id },
        data: { picture },
      });
      return {
        message: 'Profile updated',
        user: profileResponseUser(user),
      };
    } catch {
      throw new NotFoundException('User not found');
    }
  }
}

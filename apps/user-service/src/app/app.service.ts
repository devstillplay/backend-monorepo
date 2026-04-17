import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@my-workspace/prisma';

export const USER_SERVICE = 'USER_SERVICE';

function profileUserShape(user: {
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

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      message: 'User profile',
      user: profileUserShape(user),
    };
  }

  async updateUserProfile(userId: string, data: { picture: string }) {
    const trimmed = data.picture?.trim();
    if (!trimmed) {
      throw new BadRequestException('picture URL is required');
    }
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: { picture: trimmed },
      });
      return {
        message: 'Profile updated',
        user: profileUserShape(user),
      };
    } catch {
      throw new NotFoundException('User not found');
    }
  }

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        userNumber: true,
        email: true,
        firstName: true,
        lastName: true,
        picture: true,
        role: true,
        verified: true,
        createdAt: true,
      },
    });
    return { users };
  }
}

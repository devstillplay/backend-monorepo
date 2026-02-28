import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@my-workspace/prisma';

export const USER_SERVICE = 'USER_SERVICE';

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
      user: {
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
      },
    };
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

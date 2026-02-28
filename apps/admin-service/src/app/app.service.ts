import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService, generateSpNumber } from '@my-workspace/prisma';
import { Role } from './enums/role.enum';

const SALT_ROUNDS = 10;

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  // ---------- User management ----------
  async listUsers() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userNumber: true,
        email: true,
        firstName: true,
        lastName: true,
        picture: true,
        role: true,
        verified: true,
        suspended: true,
        creditLimit: true,
        createdAt: true,
      },
    });
    return { users };
  }

  async getUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    const { password: _, ...rest } = user;
    return rest;
  }

  async createUser(payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    nin: string;
    picture?: string;
  }) {
    const [existingByEmail, existingByNin] = await Promise.all([
      this.prisma.user.findUnique({ where: { email: payload.email } }),
      this.prisma.user.findUnique({ where: { nin: payload.nin } }),
    ]);
    if (existingByEmail) throw new ConflictException('User with this email already exists');
    if (existingByNin) throw new ConflictException('User with this NIN already registered');
    const userNumber = await this.ensureUniqueUserNumber('user');
    const hashedPassword = await bcrypt.hash(payload.password, SALT_ROUNDS);
    const user = await this.prisma.user.create({
      data: {
        userNumber,
        email: payload.email,
        password: hashedPassword,
        firstName: payload.firstName,
        lastName: payload.lastName,
        nin: payload.nin,
        picture: payload.picture ?? null,
      },
    });
    const { password: _, ...rest } = user;
    return { message: 'User created', user: rest };
  }

  async updateUser(
    id: string,
    payload: Partial<{
      email: string;
      firstName: string;
      lastName: string;
      nin: string;
      picture: string;
      verified: boolean;
      suspended: boolean;
      creditLimit: number | null;
    }>
  ) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    if (payload.nin != null && payload.nin !== user.nin) {
      const existingByNin = await this.prisma.user.findUnique({ where: { nin: payload.nin } });
      if (existingByNin) throw new ConflictException('User with this NIN already registered');
    }
    const updated = await this.prisma.user.update({
      where: { id },
      data: payload as Record<string, unknown>,
    });
    const { password: _, ...rest } = updated;
    return { message: 'User updated', user: rest };
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    await this.prisma.$transaction(async (tx) => {
      const loans = await tx.loan.findMany({ where: { userId: id }, select: { id: true } });
      const loanIds = loans.map((l) => l.id);
      if (loanIds.length > 0) {
        await tx.loanFunding.deleteMany({ where: { loanId: { in: loanIds } } });
      }
      await tx.loan.deleteMany({ where: { userId: id } });
      await tx.wallet.deleteMany({ where: { userId: id } });
      await tx.user.delete({ where: { id } });
    });
    return { message: 'User deleted' };
  }

  async verifyUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    const updated = await this.prisma.user.update({
      where: { id },
      data: { verified: true },
    });
    const { password: _, ...rest } = updated;
    return { message: 'User verified', user: rest };
  }

  // ---------- Employee management ----------
  async listEmployees() {
    const employees = await this.prisma.employee.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return { employees: employees.map((e) => ({ ...e, password: undefined })) };
  }

  async getEmployee(id: string) {
    const employee = await this.prisma.employee.findUnique({ where: { id } });
    if (!employee) throw new NotFoundException('Employee not found');
    const { password: _, ...rest } = employee;
    return rest;
  }

  async createEmployee(payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: Role | string;
  }) {
    const existing = await this.prisma.employee.findUnique({
      where: { email: payload.email },
    });
    if (existing) throw new ConflictException('Employee with this email already exists');
    const employeeNumber = await this.ensureUniqueUserNumber('employee');
    const hashedPassword = await bcrypt.hash(payload.password, SALT_ROUNDS);
    const role =
      payload.role != null
        ? typeof payload.role === 'string'
          ? payload.role
          : payload.role
        : Role.Operations;
    const employee = await this.prisma.employee.create({
      data: {
        employeeNumber,
        email: payload.email,
        password: hashedPassword,
        firstName: payload.firstName,
        lastName: payload.lastName,
        role,
      },
    });
    const { password: _, ...rest } = employee;
    return { message: 'Employee created', employee: rest };
  }

  async updateEmployee(
    id: string,
    payload: Partial<{
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      active: boolean;
    }>
  ) {
    const employee = await this.prisma.employee.findUnique({ where: { id } });
    if (!employee) throw new NotFoundException('Employee not found');
    const updated = await this.prisma.employee.update({
      where: { id },
      data: payload as Record<string, unknown>,
    });
    const { password: _, ...rest } = updated;
    return { message: 'Employee updated', employee: rest };
  }

  async deleteEmployee(id: string) {
    const employee = await this.prisma.employee.findUnique({ where: { id } });
    if (!employee) throw new NotFoundException('Employee not found');
    await this.prisma.employee.delete({ where: { id } });
    return { message: 'Employee deleted' };
  }

  // ---------- Admin activity (attached to user) ----------
  async createActivity(payload: { userId: string; action: string; ip?: string }) {
    const delegate = (this.prisma as unknown as { adminActivity: { create: (args: unknown) => Promise<{ id: string; userId: string; action: string; ip: string | null; createdAt: Date }> } }).adminActivity;
    const activity = await delegate.create({
      data: {
        userId: payload.userId,
        action: payload.action,
        ip: payload.ip ?? null,
      },
    });
    return { message: 'Activity recorded', activity: { id: activity.id, userId: activity.userId, action: activity.action, ip: activity.ip, createdAt: activity.createdAt } };
  }

  async listActivitiesByUser(userId: string, limit = 50) {
    const delegate = (this.prisma as unknown as { adminActivity: { findMany: (args: unknown) => Promise<{ id: string; userId: string; action: string; ip: string | null; createdAt: Date }[]> } }).adminActivity;
    const activities = await delegate.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return { activities };
  }

  private async ensureUniqueUserNumber(
    type: 'user' | 'employee'
  ): Promise<string> {
    for (let attempt = 0; attempt < 15; attempt++) {
      const candidate = generateSpNumber();
      if (type === 'user') {
        const exists = await this.prisma.user.findUnique({
          where: { userNumber: candidate },
        });
        if (!exists) return candidate;
      } else {
        const exists = await this.prisma.employee.findUnique({
          where: { employeeNumber: candidate },
        });
        if (!exists) return candidate;
      }
    }
    throw new ConflictException('Could not generate unique number');
  }
}

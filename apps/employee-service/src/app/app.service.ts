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

  // ---------- Role management ----------
  getRoles() {
    return {
      roles: Object.values(Role),
    };
  }

  async assignRoleToEmployee(employeeId: string, role: Role | string) {
    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
    });
    if (!employee) throw new NotFoundException('Employee not found');
    const roleValue = typeof role === 'string' ? role : role;
    const updated = await this.prisma.employee.update({
      where: { id: employeeId },
      data: { role: roleValue },
    });
    const { password: _, ...rest } = updated;
    return { message: 'Role assigned', employee: rest };
  }

  // ---------- User management (roles not important for users) ----------
  async createUser(payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    nin: string;
    picture?: string;
  }) {
    const existing = await this.prisma.user.findUnique({
      where: { email: payload.email },
    });
    if (existing) throw new ConflictException('User with this email already exists');
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

  async editUser(
    id: string,
    payload: Partial<{
      email: string;
      firstName: string;
      lastName: string;
      nin: string;
      picture: string;
      verified: boolean;
    }>
  ) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
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
    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted' };
  }

  // ---------- Employee management (use Role when creating) ----------
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
    const role =
      payload.role != null
        ? typeof payload.role === 'string'
          ? payload.role
          : payload.role
        : Role.Operations;
    const hashedPassword = await bcrypt.hash(payload.password, SALT_ROUNDS);
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

  async editEmployee(
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

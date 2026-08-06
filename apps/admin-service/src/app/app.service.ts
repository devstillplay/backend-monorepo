import {
  BadRequestException,
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
    const email = payload.email?.trim()?.toLowerCase();
    const firstName = payload.firstName?.trim();
    const lastName = payload.lastName?.trim();
    const password = payload.password;
    if (!email || !password || !firstName || !lastName) {
      throw new BadRequestException('email, password, firstName and lastName are required');
    }
    if (password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }
    const [existingEmployee, existingUser] = await Promise.all([
      this.prisma.employee.findUnique({ where: { email } }),
      this.prisma.user.findUnique({ where: { email }, select: { id: true } }),
    ]);
    if (existingEmployee) throw new ConflictException('Employee with this email already exists');
    if (existingUser) {
      throw new ConflictException(
        'This email is already used by a customer account. Use a different email for staff, or remove the conflicting user first.'
      );
    }
    const employeeNumber = await this.ensureUniqueUserNumber('employee');
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const role =
      payload.role != null
        ? typeof payload.role === 'string'
          ? payload.role
          : payload.role
        : Role.Operations;
    const employee = await this.prisma.employee.create({
      data: {
        employeeNumber,
        email,
        password: hashedPassword,
        firstName,
        lastName,
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
    const data: Record<string, unknown> = {};
    if (payload.email !== undefined) {
      const email = payload.email.trim().toLowerCase();
      if (!email) throw new BadRequestException('email cannot be empty');
      if (email !== employee.email) {
        const [otherEmployee, existingUser] = await Promise.all([
          this.prisma.employee.findUnique({ where: { email } }),
          this.prisma.user.findUnique({ where: { email }, select: { id: true } }),
        ]);
        if (otherEmployee) throw new ConflictException('Employee with this email already exists');
        if (existingUser) {
          throw new ConflictException(
            'This email is already used by a customer account. Use a different email for staff.'
          );
        }
      }
      data.email = email;
    }
    if (payload.firstName !== undefined) data.firstName = payload.firstName.trim();
    if (payload.lastName !== undefined) data.lastName = payload.lastName.trim();
    if (payload.role !== undefined) data.role = payload.role;
    if (payload.active !== undefined) data.active = payload.active;
    if (Object.keys(data).length === 0) {
      const { password: _, ...rest } = employee;
      return { message: 'Employee unchanged', employee: rest };
    }
    const updated = await this.prisma.employee.update({
      where: { id },
      data,
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

  // ---------- Waitlist (public signup + admin list) ----------
  async createWaitlistEntry(payload: {
    fullName: string;
    email: string;
    source: 'landing' | 'partners' | 'financial';
    businessName?: string;
    partnerType?: string;
  }) {
    const email = payload?.email?.trim()?.toLowerCase();
    const fullName = payload?.fullName?.trim();
    const source = payload?.source;
    if (!email || !fullName) {
      throw new BadRequestException('fullName and email are required');
    }
    if (source !== 'landing' && source !== 'partners' && source !== 'financial') {
      throw new BadRequestException('source must be landing, partners, or financial');
    }
    let businessName = payload.businessName?.trim() || null;
    let partnerType = payload.partnerType?.trim() || null;
    if (source === 'financial') {
      if (!businessName) {
        throw new BadRequestException('businessName is required for financial partner signups');
      }
      if (!partnerType) {
        partnerType = 'Financial Institution';
      }
    }
    if (source === 'partners' && (!businessName || !partnerType)) {
      throw new BadRequestException('businessName and partnerType are required for partners');
    }

    const existing = await this.prisma.waitlistEntry.findFirst({ where: { email } });
    if (existing) {
      const updated = await this.prisma.waitlistEntry.update({
        where: { id: existing.id },
        data: {
          fullName,
          source,
          businessName,
          partnerType,
        },
      });
      return { message: 'Waitlist entry updated', entry: updated };
    }

    const entry = await this.prisma.waitlistEntry.create({
      data: {
        email,
        fullName,
        source,
        businessName,
        partnerType,
      },
    });
    return { message: 'Joined waitlist', entry };
  }

  async listWaitlistEntries() {
    const entries = await this.prisma.waitlistEntry.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return { entries };
  }

  private slugify(input: string): string {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 80);
  }

  private async uniqueBlogSlug(base: string, excludeId?: string): Promise<string> {
    let slug = base || `post-${Date.now()}`;
    for (let i = 0; i < 20; i++) {
      const candidate = i === 0 ? slug : `${slug}-${i + 1}`;
      const existing = await this.prisma.blogPost.findUnique({
        where: { slug: candidate },
      });
      if (!existing || (excludeId && existing.id === excludeId)) {
        return candidate;
      }
    }
    return `${slug}-${Date.now()}`;
  }

  async listBlogPosts(options?: { publishedOnly?: boolean }) {
    const where = options?.publishedOnly
      ? { status: 'published' }
      : undefined;
    const posts = await this.prisma.blogPost.findMany({
      where,
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    });
    return { posts };
  }

  async getBlogPostBySlug(slug: string, options?: { publishedOnly?: boolean }) {
    const post = await this.prisma.blogPost.findUnique({ where: { slug } });
    if (!post) {
      throw new NotFoundException('Blog post not found');
    }
    if (options?.publishedOnly && post.status !== 'published') {
      throw new NotFoundException('Blog post not found');
    }
    return { post };
  }

  async getBlogPostById(id: string) {
    const post = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException('Blog post not found');
    }
    return { post };
  }

  async createBlogPost(payload: {
    title?: string;
    slug?: string;
    excerpt?: string | null;
    content?: string;
    coverImage?: string | null;
    status?: string;
    authorName?: string | null;
    publishedAt?: string | Date | null;
  }) {
    const title = payload?.title?.trim();
    const content = payload?.content?.trim();
    if (!title) {
      throw new BadRequestException('title is required');
    }
    if (!content) {
      throw new BadRequestException('content is required');
    }
    const status =
      payload.status === 'published' || payload.status === 'draft'
        ? payload.status
        : 'draft';
    const baseSlug = this.slugify(payload.slug?.trim() || title);
    const slug = await this.uniqueBlogSlug(baseSlug);
    const publishedAt =
      status === 'published'
        ? payload.publishedAt
          ? new Date(payload.publishedAt)
          : new Date()
        : payload.publishedAt
          ? new Date(payload.publishedAt)
          : null;

    const post = await this.prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt: payload.excerpt?.trim() || null,
        content,
        coverImage: payload.coverImage?.trim() || null,
        status,
        authorName: payload.authorName?.trim() || null,
        publishedAt,
      },
    });
    return { message: 'Blog post created', post };
  }

  async updateBlogPost(
    id: string,
    payload: {
      title?: string;
      slug?: string;
      excerpt?: string | null;
      content?: string;
      coverImage?: string | null;
      status?: string;
      authorName?: string | null;
      publishedAt?: string | Date | null;
    }
  ) {
    const existing = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Blog post not found');
    }

    const data: {
      title?: string;
      slug?: string;
      excerpt?: string | null;
      content?: string;
      coverImage?: string | null;
      status?: string;
      authorName?: string | null;
      publishedAt?: Date | null;
    } = {};

    if (payload.title !== undefined) {
      const title = payload.title.trim();
      if (!title) throw new BadRequestException('title cannot be empty');
      data.title = title;
    }
    if (payload.content !== undefined) {
      const content = payload.content.trim();
      if (!content) throw new BadRequestException('content cannot be empty');
      data.content = content;
    }
    if (payload.excerpt !== undefined) {
      data.excerpt = payload.excerpt?.trim() || null;
    }
    if (payload.coverImage !== undefined) {
      data.coverImage = payload.coverImage?.trim() || null;
    }
    if (payload.authorName !== undefined) {
      data.authorName = payload.authorName?.trim() || null;
    }
    if (payload.status !== undefined) {
      if (payload.status !== 'published' && payload.status !== 'draft') {
        throw new BadRequestException('status must be draft or published');
      }
      data.status = payload.status;
      if (payload.status === 'published' && !existing.publishedAt && payload.publishedAt == null) {
        data.publishedAt = new Date();
      }
    }
    if (payload.publishedAt !== undefined) {
      data.publishedAt = payload.publishedAt
        ? new Date(payload.publishedAt)
        : null;
    }
    if (payload.slug !== undefined || payload.title !== undefined) {
      const base = this.slugify(
        (payload.slug?.trim() || payload.title?.trim() || existing.slug) ??
          existing.slug
      );
      data.slug = await this.uniqueBlogSlug(base, id);
    }

    const post = await this.prisma.blogPost.update({
      where: { id },
      data,
    });
    return { message: 'Blog post updated', post };
  }

  async deleteBlogPost(id: string) {
    const existing = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Blog post not found');
    }
    await this.prisma.blogPost.delete({ where: { id } });
    return { message: 'Blog post deleted', id };
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

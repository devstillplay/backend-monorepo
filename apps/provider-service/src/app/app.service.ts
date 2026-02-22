import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService, generateSpNumber } from '@my-workspace/prisma';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async createProvider(payload: {
    name: string;
    email?: string;
    agreedAmount?: number;
    percentageToAdd?: number;
    agreedAt?: string; // ISO date
    agreedTerms?: string;
  }) {
    let providerNumber: string;
    let exists: { id: string } | null;
    do {
      providerNumber = generateSpNumber();
      exists = await this.prisma.provider.findUnique({
        where: { providerNumber },
        select: { id: true },
      });
    } while (exists);
    const provider = await this.prisma.provider.create({
      data: {
        providerNumber,
        name: payload.name,
        email: payload.email ?? null,
        agreedAmount: payload.agreedAmount ?? null,
        percentageToAdd: payload.percentageToAdd ?? 0,
        agreedAt: payload.agreedAt ? new Date(payload.agreedAt) : null,
        agreedTerms: payload.agreedTerms ?? null,
      },
    });
    await this.prisma.providerWallet.create({
      data: {
        providerId: provider.id,
        balance: 0,
        totalFunded: 0,
        currency: 'NGN',
      },
    });
    const wallet = await this.prisma.providerWallet.findUnique({
      where: { providerId: provider.id },
    });
    return { message: 'Provider created', provider, wallet };
  }

  async listProviders() {
    const providers = await this.prisma.provider.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return { providers };
  }

  async getProvider(providerId: string) {
    const provider = await this.prisma.provider.findUnique({
      where: { id: providerId },
    });
    if (!provider) throw new NotFoundException('Provider not found');
    return provider;
  }

  async updateProvider(
    providerId: string,
    payload: {
      name?: string;
      email?: string;
      agreedAmount?: number | null;
      percentageToAdd?: number;
      agreedAt?: string | null;
      agreedTerms?: string | null;
    }
  ) {
    const provider = await this.prisma.provider.findUnique({
      where: { id: providerId },
    });
    if (!provider) throw new NotFoundException('Provider not found');
    const updated = await this.prisma.provider.update({
      where: { id: providerId },
      data: {
        ...(payload.name != null && { name: payload.name }),
        ...(payload.email !== undefined && { email: payload.email ?? null }),
        ...(payload.agreedAmount !== undefined && { agreedAmount: payload.agreedAmount ?? null }),
        ...(payload.percentageToAdd != null && { percentageToAdd: payload.percentageToAdd }),
        ...(payload.agreedAt !== undefined && {
          agreedAt: payload.agreedAt ? new Date(payload.agreedAt) : null,
        }),
        ...(payload.agreedTerms !== undefined && { agreedTerms: payload.agreedTerms ?? null }),
      },
    });
    return { message: 'Provider updated', provider: updated };
  }

  async getProviderWallet(providerId: string) {
    const wallet = await this.prisma.providerWallet.findUnique({
      where: { providerId },
    });
    if (!wallet) throw new NotFoundException('Provider wallet not found');
    return wallet;
  }

  /** History of credits to this provider (amount returned to them) */
  async getProviderCredits(providerId: string, limit = 50) {
    const credits = await this.prisma.providerCredit.findMany({
      where: { providerId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return { credits };
  }

  /** Funding history: which loans this provider funded and how much */
  async getProviderFunding(providerId: string, limit = 50) {
    const funding = await this.prisma.loanFunding.findMany({
      where: { providerId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return { funding };
  }
}

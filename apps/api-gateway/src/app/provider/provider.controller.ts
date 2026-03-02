import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from '../guards/auth/auth.guard';

export const PROVIDER_SERVICE = 'PROVIDER_SERVICE';

function handleProviderError(err: unknown): never {
  const o = err && typeof err === 'object' ? (err as Record<string, unknown>) : {};
  const payload = (o.error ?? o.response ?? o) as Record<string, unknown> | undefined;
  const statusCode = Number(
    o.statusCode ?? payload?.statusCode ?? payload?.status ?? 500
  );
  const message =
    typeof o.message === 'string'
      ? o.message
      : typeof payload?.message === 'string'
        ? payload.message
        : err instanceof Error
          ? err.message
          : 'Internal server error';
  throw new HttpException(
    Array.isArray(message) ? message[0] : message,
    statusCode >= 400 && statusCode < 600 ? statusCode : 500
  );
}

@Controller('providers')
@UseGuards(AuthGuard)
export class ProviderController {
  constructor(
    @Inject(PROVIDER_SERVICE) private readonly providerClient: ClientProxy,
  ) {}

  @Get('banks')
  async getBanks(@Query('currency') currency?: string) {
    try {
      return await firstValueFrom(
        this.providerClient.send('provider-banks-list', {
          currency: currency ?? 'NGN',
        })
      );
    } catch (err) {
      handleProviderError(err);
    }
  }

  @Get('disbursement')
  async listForDisbursement() {
    try {
      return await firstValueFrom(
        this.providerClient.send('provider-list-for-disbursement', {})
      );
    } catch (err) {
      handleProviderError(err);
    }
  }

  @Post('disbursement')
  async executeDisbursement(
    @Body()
    body: {
      transfers: { providerId: string; amount: number }[];
      currency?: string;
      simulate?: boolean;
    },
  ) {
    if (!body?.transfers?.length) {
      throw new BadRequestException('transfers array is required');
    }
    try {
      return await firstValueFrom(
        this.providerClient.send('provider-disbursement', {
          transfers: body.transfers,
          currency: body.currency ?? 'NGN',
          simulate: body.simulate ?? false,
        })
      );
    } catch (err) {
      handleProviderError(err);
    }
  }

  @Get('verify-transfer/:reference')
  async verifyTransfer(@Param('reference') reference: string) {
    try {
      return await firstValueFrom(
        this.providerClient.send('provider-verify-transfer', reference)
      );
    } catch (err) {
      handleProviderError(err);
    }
  }

  @Delete(':providerId')
  async delete(
    @Param('providerId') providerId: string,
    @Query('payoutFirst') payoutFirst?: string,
  ) {
    try {
      return await firstValueFrom(
        this.providerClient.send('provider-delete', {
          providerId,
          payoutFirst: payoutFirst === 'true' || payoutFirst === '1',
        })
      );
    } catch (err) {
      handleProviderError(err);
    }
  }

  @Get(':providerId/payouts')
  async getPayouts(
    @Param('providerId') providerId: string,
    @Query('limit') limit?: string,
  ) {
    try {
      return await firstValueFrom(
        this.providerClient.send('provider-payouts', {
          providerId,
          limit: limit != null ? parseInt(limit, 10) : undefined,
        })
      );
    } catch (err) {
      handleProviderError(err);
    }
  }

  @Post()
  async create(
    @Body()
    body: {
      name: string;
      email?: string;
      accountNumber?: string;
      bankName?: string;
      bankCode?: string;
      agreedAmount?: number;
      percentageToAdd?: number;
      providerCutPercentage?: number;
      agreedAt?: string;
      agreedTerms?: string;
    },
  ) {
    if (!body?.name?.trim()) throw new BadRequestException('name is required');
    try {
      return await firstValueFrom(
        this.providerClient.send('provider-create', {
          name: body.name.trim(),
          email: body.email,
      accountNumber: body.accountNumber,
      bankName: body.bankName,
      bankCode: body.bankCode,
          agreedAmount: body.agreedAmount,
          percentageToAdd: body.percentageToAdd,
          providerCutPercentage: body.providerCutPercentage,
          agreedAt: body.agreedAt,
          agreedTerms: body.agreedTerms,
        })
      );
    } catch (err) {
      handleProviderError(err);
    }
  }

  @Get()
  async list() {
    try {
      return await firstValueFrom(
        this.providerClient.send('provider-list', {})
      );
    } catch (err) {
      handleProviderError(err);
    }
  }

  @Get(':providerId')
  async getOne(@Param('providerId') providerId: string) {
    try {
      return await firstValueFrom(
        this.providerClient.send('provider-get', providerId)
      );
    } catch (err) {
      handleProviderError(err);
    }
  }

  @Patch(':providerId')
  async update(
    @Param('providerId') providerId: string,
    @Body()
    body: {
      name?: string;
      email?: string;
      accountNumber?: string | null;
      bankName?: string | null;
      bankCode?: string | null;
      agreedAmount?: number | null;
      percentageToAdd?: number;
      providerCutPercentage?: number;
      agreedAt?: string | null;
      agreedTerms?: string | null;
    },
  ) {
    try {
      return await firstValueFrom(
        this.providerClient.send('provider-update', {
          providerId,
          name: body?.name,
          email: body?.email,
          accountNumber: body?.accountNumber,
          bankName: body?.bankName,
          bankCode: body?.bankCode,
          agreedAmount: body?.agreedAmount,
          percentageToAdd: body?.percentageToAdd,
          providerCutPercentage: body?.providerCutPercentage,
          agreedAt: body?.agreedAt,
          agreedTerms: body?.agreedTerms,
        })
      );
    } catch (err) {
      handleProviderError(err);
    }
  }

  @Get(':providerId/wallet')
  async getWallet(@Param('providerId') providerId: string) {
    try {
      return await firstValueFrom(
        this.providerClient.send('provider-wallet-get', providerId)
      );
    } catch (err) {
      handleProviderError(err);
    }
  }

  @Get(':providerId/credits')
  async getCredits(
    @Param('providerId') providerId: string,
    @Query('limit') limit?: string,
  ) {
    try {
      return await firstValueFrom(
        this.providerClient.send('provider-credits', {
          providerId,
          limit: limit != null ? parseInt(limit, 10) : undefined,
        })
      );
    } catch (err) {
      handleProviderError(err);
    }
  }

  @Get(':providerId/funding')
  async getFunding(
    @Param('providerId') providerId: string,
    @Query('limit') limit?: string,
  ) {
    try {
      return await firstValueFrom(
        this.providerClient.send('provider-funding', {
          providerId,
          limit: limit != null ? parseInt(limit, 10) : undefined,
        })
      );
    } catch (err) {
      handleProviderError(err);
    }
  }
}

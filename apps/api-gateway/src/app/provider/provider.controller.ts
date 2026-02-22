import {
  BadRequestException,
  Body,
  Controller,
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

  @Post()
  async create(
    @Body()
    body: {
      name: string;
      email?: string;
      agreedAmount?: number;
      percentageToAdd?: number;
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
          agreedAmount: body.agreedAmount,
          percentageToAdd: body.percentageToAdd,
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
      agreedAmount?: number | null;
      percentageToAdd?: number;
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
          agreedAmount: body?.agreedAmount,
          percentageToAdd: body?.percentageToAdd,
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

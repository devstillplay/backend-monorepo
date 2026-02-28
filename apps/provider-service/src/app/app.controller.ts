import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('provider-create')
  createProvider(
    @Payload()
    payload: {
      name: string;
      email?: string;
      accountNumber?: string;
      bankName?: string;
      agreedAmount?: number;
      percentageToAdd?: number;
      providerCutPercentage?: number;
      agreedAt?: string;
      agreedTerms?: string;
    }
  ) {
    return this.appService.createProvider(payload);
  }

  @MessagePattern('provider-list')
  listProviders() {
    return this.appService.listProviders();
  }

  @MessagePattern('provider-get')
  getProvider(@Payload() providerId: string) {
    return this.appService.getProvider(providerId);
  }

  @MessagePattern('provider-update')
  updateProvider(
    @Payload() payload: {
      providerId: string;
      name?: string;
      email?: string;
      accountNumber?: string | null;
      bankName?: string | null;
      agreedAmount?: number | null;
      percentageToAdd?: number;
      providerCutPercentage?: number;
      agreedAt?: string | null;
      agreedTerms?: string | null;
    }
  ) {
    return this.appService.updateProvider(payload.providerId, {
      name: payload.name,
      email: payload.email,
      accountNumber: payload.accountNumber,
      bankName: payload.bankName,
      agreedAmount: payload.agreedAmount,
      percentageToAdd: payload.percentageToAdd,
      providerCutPercentage: payload.providerCutPercentage,
      agreedAt: payload.agreedAt,
      agreedTerms: payload.agreedTerms,
    });
  }

  @MessagePattern('provider-wallet-get')
  getProviderWallet(@Payload() providerId: string) {
    return this.appService.getProviderWallet(providerId);
  }

  @MessagePattern('provider-credits')
  getProviderCredits(@Payload() payload: { providerId: string; limit?: number }) {
    return this.appService.getProviderCredits(
      payload.providerId,
      payload.limit
    );
  }

  @MessagePattern('provider-funding')
  getProviderFunding(@Payload() payload: { providerId: string; limit?: number }) {
    return this.appService.getProviderFunding(
      payload.providerId,
      payload.limit
    );
  }
}

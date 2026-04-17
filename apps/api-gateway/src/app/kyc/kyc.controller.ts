import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { KycService } from './kyc.service';

/** Public KYC helpers (signup flow). Reference IDs are unguessable enough for practical use; rate-limit in production if needed. */
@Controller('kyc')
export class KycController {
  constructor(private readonly kyc: KycService) {}

  /**
   * Fetch verification payload from Dojah for a completed Easy Onboard `reference_id`.
   * @see https://docs.dojah.io/docs/technical-reference/get-verification-details
   */
  @Get('dojah-verification')
  async dojahVerification(@Query('referenceId') referenceId: string) {
    const ref = referenceId?.trim();
    if (!ref || ref.length > 256) {
      throw new BadRequestException('referenceId is required');
    }
    const dojah = await this.kyc.getDojahVerification(ref);
    return { referenceId: ref, dojah };
  }
}

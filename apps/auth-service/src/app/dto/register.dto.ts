export class RegisterDto {
  firstName: string;
  lastName: string;
  nin: string;
  email: string;
  password: string;
  picture?: string;
  ninSlip?: string;
  /**
   * Dojah Easy Onboard session reference after KYC success (`reference_id` in widget callback).
   * When present, user is marked `verified` at signup. For production, confirm via Dojah API or webhooks.
   */
  dojahReferenceId?: string;
}

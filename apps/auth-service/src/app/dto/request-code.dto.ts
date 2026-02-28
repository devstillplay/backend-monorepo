export type RequestCodeType = 'login' | 'register';

export class RequestCodeDto {
  type: RequestCodeType;
  email: string;
  password: string;
  /** Required when type === 'register' */
  firstName?: string;
  lastName?: string;
  nin?: string;
  picture?: string;
  /** Optional URL to NIN slip image for registration */
  ninSlip?: string;
}

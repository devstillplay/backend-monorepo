import { RequestCodeType } from './request-code.dto';

export class VerifyCodeDto {
  type: RequestCodeType;
  email: string;
  code: string;
}

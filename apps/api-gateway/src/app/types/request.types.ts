import type { Request } from 'express';

export type RequestWithUser = Request & {
  user: { id: string; email: string; role: string; verified: boolean };
};

import { ServiceUnavailableException } from '@nestjs/common';

const CONNECTION_ERROR_CODES = new Set(['ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND', 'ECONNRESET']);
const CONNECTION_MESSAGES = ['connect', 'connection', 'unreachable', 'timeout'];

function isConnectionError(err: unknown): boolean {
  if (err && typeof err === 'object') {
    const o = err as Record<string, unknown>;
    const code = o.code ?? (o.error as Record<string, unknown>)?.code;
    if (typeof code === 'string' && CONNECTION_ERROR_CODES.has(code)) return true;
    const msg = String(o.message ?? (o.error as Record<string, unknown>)?.message ?? '').toLowerCase();
    if (CONNECTION_MESSAGES.some((m) => msg.includes(m))) return true;
  }
  if (err instanceof Error) {
    if ('code' in err && typeof (err as NodeJS.ErrnoException).code === 'string' && CONNECTION_ERROR_CODES.has((err as NodeJS.ErrnoException).code!)) return true;
    if (CONNECTION_MESSAGES.some((m) => err.message.toLowerCase().includes(m))) return true;
  }
  return false;
}

/**
 * If the error is a TCP/connection failure to a backend microservice, throws 503 with a clear message.
 * Otherwise returns (caller should handle as normal business error).
 */
export function throwIfServiceUnavailable(err: unknown, serviceLabel: string): void {
  if (isConnectionError(err)) {
    const localHints: Record<string, string> = {
      Auth: ' For local dev, start auth-service: npx nx serve auth-service (TCP 8877).',
      User: ' For local dev, start user-service: npx nx serve user-service (TCP 8878).',
    };
    const envHint =
      localHints[serviceLabel] ??
      ` If deployed, set ${serviceLabel.toUpperCase().replace(/\s/g, '_')}_SERVICE_HOST and PORT.`;
    throw new ServiceUnavailableException(
      `Service temporarily unavailable. Please try again.${envHint}`,
    );
  }
}

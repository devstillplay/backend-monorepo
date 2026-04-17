import { HttpException, ServiceUnavailableException } from '@nestjs/common';

const CONNECTION_ERROR_CODES = new Set(['ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND', 'ECONNRESET']);
const CONNECTION_MESSAGES = ['connect', 'connection', 'unreachable', 'timeout'];

function isConnectionError(err: unknown): boolean {
  if (err && typeof err === 'object') {
    const o = err as Record<string, unknown>;
    // Nest ClientProxy often throws plain objects with name "AggregateError" (no global type in older TS lib).
    if (o.name === 'AggregateError') {
      const agg = o.errors as unknown[] | undefined;
      if (Array.isArray(agg) && agg.some((e) => isConnectionError(e))) return true;
    }
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
      Admin: ' For local dev, start admin-service: npx nx serve admin-service (TCP 8879).',
    };
    const envHint =
      localHints[serviceLabel] ??
      ` If deployed, set ${serviceLabel.toUpperCase().replace(/\s/g, '_')}_SERVICE_HOST and PORT.`;
    throw new ServiceUnavailableException(
      `Service temporarily unavailable. Please try again.${envHint}`,
    );
  }
}

/**
 * Use in API gateway when an {@link ClientProxy} call to admin-service fails.
 * Maps TCP/aggregate connection errors to 503; otherwise forwards RPC error message and status.
 */
export function rethrowAdminMicroserviceError(err: unknown): never {
  throwIfServiceUnavailable(err, 'Admin');
  const o = err && typeof err === 'object' ? (err as Record<string, unknown>) : {};
  const inner = (o.error ?? o.response ?? o) as Record<string, unknown> | undefined;
  const status = Number(
    o.statusCode ?? inner?.statusCode ?? inner?.status ?? 500
  );
  const raw =
    (typeof o.message === 'string' ? o.message : undefined) ??
    (typeof inner?.message === 'string' ? inner.message : undefined) ??
    (err instanceof Error ? err.message : '');
  const msg =
    typeof raw === 'string' ? raw : Array.isArray(raw) ? String(raw[0] ?? '') : '';
  const finalMsg = msg.trim() || 'Internal server error';
  const httpStatus = status >= 400 && status < 600 ? status : 500;
  throw new HttpException(finalMsg, httpStatus);
}

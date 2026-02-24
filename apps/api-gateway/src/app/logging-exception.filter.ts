import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class LoggingExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(LoggingExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const status =
      exception && typeof exception === 'object' && 'getStatus' in exception
        ? (exception as { getStatus: () => number }).getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception && typeof exception === 'object' && 'message' in exception
        ? String((exception as { message: unknown }).message)
        : 'Internal server error';
    const responseBody =
      exception && typeof exception === 'object' && 'getResponse' in exception
        ? (exception as { getResponse: () => unknown }).getResponse()
        : null;

    if (status >= 500) {
      this.logger.error(`[${status}] ${message}`);
      if (exception instanceof Error && exception.stack) {
        this.logger.error(exception.stack);
      } else if (exception !== null && typeof exception === 'object') {
        this.logger.error('Exception object: ' + JSON.stringify(exception));
      }
    }

    let body: Record<string, unknown>;
    if (typeof responseBody === 'object' && responseBody !== null) {
      body = { ...(responseBody as Record<string, unknown>) };
    } else {
      body = { message: typeof responseBody === 'string' ? responseBody : message };
    }
    if (typeof body.statusCode !== 'number') body.statusCode = status;
    if (!('message' in body)) body.message = message;

    res.status(status).json(body);
  }
}

import { ArgumentsHost, Catch, HttpException, HttpStatus } from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';

@Catch()
export class RpcExceptionFilter extends BaseRpcExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? exception.message
        : exception instanceof Error
          ? exception.message
          : 'Internal server error';
    const payload =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message };
    const msg =
      typeof payload === 'object' && payload !== null && 'message' in payload
        ? (payload as { message: string | string[] }).message
        : message;
    let finalMessage = Array.isArray(msg) ? msg[0] : String(msg ?? '');
    finalMessage = typeof finalMessage === 'string' && finalMessage.trim() ? finalMessage.trim() : 'Internal server error';
    return super.catch(
      new RpcException({ statusCode, message: finalMessage }),
      host
    );
  }
}

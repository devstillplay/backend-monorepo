/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { RpcExceptionFilter } from './app/rpc-exception.filter';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const port = parseInt(process.env.AUTH_TCP_PORT ?? '8877', 10) || 8877;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port,
      },
    }
  );
  app.useGlobalFilters(new RpcExceptionFilter());
  await app.listen();
  Logger.log(`🚀 Auth service running on: TCP:${port}`);
}

bootstrap();

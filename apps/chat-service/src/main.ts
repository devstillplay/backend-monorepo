import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { RpcExceptionFilter } from './app/rpc-exception.filter';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const port = parseInt(process.env.CHAT_SERVICE_PORT || '8885', 10);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: { host: '0.0.0.0', port },
    },
  );
  app.useGlobalFilters(new RpcExceptionFilter());
  await app.listen();
  Logger.log(`🚀 Chat service running on: TCP:${port}`);
}

bootstrap();

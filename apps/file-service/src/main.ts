import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const port = parseInt(process.env.PORT || process.env.FILE_SERVICE_PORT || '8882', 10);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: { host: '0.0.0.0', port },
    }
  );
  await app.listen();
  Logger.log(`🚀 File service running on: TCP:${port}`);
}

bootstrap();

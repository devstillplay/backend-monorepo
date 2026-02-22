import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const port = parseInt(process.env.ADMIN_SERVICE_PORT || '8879', 10);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: { host: 'localhost', port },
    }
  );
  await app.listen();
  Logger.log(`🚀 Admin service running on: TCP:${port}`);
}

bootstrap();

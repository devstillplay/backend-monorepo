import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { join } from 'path';
import { PrismaModule } from '@my-workspace/prisma';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './email/email.module';

// On Render, env vars are set in the Dashboard (not from .env). See https://render.com/docs/configure-environment-variables
// Locally, load .env from workspace root (when running via nx serve, cwd is often workspace root)
const envPaths =
  process.env.RENDER === 'true'
    ? [] // Render injects env vars; no .env file at runtime
    : [
        '.env',
        join(process.cwd(), '.env'),
        join(process.cwd(), '..', '.env'),
        join(process.cwd(), '..', '..', '.env'),
        join(process.cwd(), '..', '..', '..', '.env'),
      ];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: envPaths }),
    PrismaModule,
    EmailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET', 'default-secret-change-me'),
        signOptions: {
          expiresIn: config.get('JWT_EXPIRES_IN', '1h'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaModule } from '@my-workspace/prisma';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AUTH_SERVICE } from './auth/auth.service';
import { UserController } from './user/user.controller';
import { AdminController } from './admin/admin.controller';
import { EmployeeController } from './employee/employee.controller';
import { NotificationController } from './notification/notification.controller';
import { FileController, FILE_SERVICE } from './file/file.controller';
import { LoanController, LOAN_SERVICE } from './loan/loan.controller';
import { ProviderController, PROVIDER_SERVICE } from './provider/provider.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get('AUTH_SERVICE_HOST', 'localhost'),
            port:
              parseInt(config.get('AUTH_SERVICE_PORT') ?? '8877', 10) || 8877,
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'USER_SERVICE',
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get('USER_SERVICE_HOST', 'localhost'),
            port:
              parseInt(config.get('USER_SERVICE_PORT') ?? '8878', 10) || 8878,
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'ADMIN_SERVICE',
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get('ADMIN_SERVICE_HOST', 'localhost'),
            port:
              parseInt(config.get('ADMIN_SERVICE_PORT') ?? '8879', 10) || 8879,
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'EMPLOYEE_SERVICE',
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get('EMPLOYEE_SERVICE_HOST', 'localhost'),
            port:
              parseInt(config.get('EMPLOYEE_SERVICE_PORT') ?? '8880', 10) || 8880,
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'NOTIFICATION_SERVICE',
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get('NOTIFICATION_SERVICE_HOST', 'localhost'),
            port:
              parseInt(config.get('NOTIFICATION_SERVICE_PORT') ?? '8881', 10) || 8881,
          },
        }),
        inject: [ConfigService],
      },
      {
        name: FILE_SERVICE,
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get('FILE_SERVICE_HOST', 'localhost'),
            port:
              parseInt(config.get('FILE_SERVICE_PORT') ?? '8882', 10) || 8882,
          },
        }),
        inject: [ConfigService],
      },
      {
        name: LOAN_SERVICE,
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get('LOAN_SERVICE_HOST', 'localhost'),
            port:
              parseInt(config.get('LOAN_SERVICE_PORT') ?? '8883', 10) || 8883,
          },
        }),
        inject: [ConfigService],
      },
      {
        name: PROVIDER_SERVICE,
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get('PROVIDER_SERVICE_HOST', 'localhost'),
            port:
              parseInt(config.get('PROVIDER_SERVICE_PORT') ?? '8884', 10) || 8884,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AppController, AuthController, UserController, AdminController, EmployeeController, NotificationController, FileController, LoanController, ProviderController],
  providers: [AppService, AuthService],
})
export class AppModule {}

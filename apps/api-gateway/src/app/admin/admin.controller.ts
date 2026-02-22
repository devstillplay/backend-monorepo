import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from '../guards/auth/auth.guard';
import type { RequestWithUser } from '../types/request.types';

@Controller('admin')
@UseGuards(AuthGuard)
export class AdminController {
  constructor(
    @Inject('ADMIN_SERVICE') private readonly adminClient: ClientProxy
  ) {}

  @Get('users')
  listUsers() {
    return firstValueFrom(this.adminClient.send('admin-users-list', {}));
  }

  @Get('users/:id')
  getUser(@Param('id') id: string) {
    return firstValueFrom(this.adminClient.send('admin-users-get', id));
  }

  @Post('users')
  createUser(@Body() body: unknown) {
    return firstValueFrom(this.adminClient.send('admin-users-create', body));
  }

  @Patch('users/:id')
  updateUser(@Param('id') id: string, @Body() body: unknown) {
    return firstValueFrom(
      this.adminClient.send('admin-users-update', { id, data: body })
    );
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return firstValueFrom(this.adminClient.send('admin-users-delete', id));
  }

  @Post('users/:id/verify')
  verifyUser(@Param('id') id: string) {
    return firstValueFrom(this.adminClient.send('admin-users-verify', id));
  }

  @Get('employees')
  listEmployees() {
    return firstValueFrom(this.adminClient.send('admin-employees-list', {}));
  }

  @Get('employees/:id')
  getEmployee(@Param('id') id: string) {
    return firstValueFrom(this.adminClient.send('admin-employees-get', id));
  }

  @Post('employees')
  createEmployee(@Body() body: unknown) {
    return firstValueFrom(
      this.adminClient.send('admin-employees-create', body)
    );
  }

  @Patch('employees/:id')
  updateEmployee(@Param('id') id: string, @Body() body: unknown) {
    return firstValueFrom(
      this.adminClient.send('admin-employees-update', { id, data: body })
    );
  }

  @Delete('employees/:id')
  deleteEmployee(@Param('id') id: string) {
    return firstValueFrom(
      this.adminClient.send('admin-employees-delete', id)
    );
  }

  @Post('activity')
  createActivity(
    @Req() req: RequestWithUser,
    @Body() body: { action: string; ip?: string }
  ) {
    return firstValueFrom(
      this.adminClient.send('admin-activity-create', {
        userId: req.user.id,
        action: body.action,
        ip: body.ip,
      })
    );
  }

  @Get('activity')
  listActivity(
    @Req() req: RequestWithUser,
    @Query('limit') limit?: string
  ) {
    return firstValueFrom(
      this.adminClient.send('admin-activity-list', {
        userId: req.user.id,
        limit: limit != null ? parseInt(limit, 10) : 50,
      })
    );
  }
}

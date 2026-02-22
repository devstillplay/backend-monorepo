import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from '../guards/auth/auth.guard';

@Controller('employee')
@UseGuards(AuthGuard)
export class EmployeeController {
  constructor(
    @Inject('EMPLOYEE_SERVICE') private readonly employeeClient: ClientProxy
  ) {}

  @Get('roles')
  getRoles() {
    return firstValueFrom(this.employeeClient.send('employee-roles-list', {}));
  }

  @Post('assign-role')
  assignRole(@Body() body: { employeeId: string; role: string }) {
    return firstValueFrom(
      this.employeeClient.send('employee-assign-role', body)
    );
  }

  @Post('users')
  createUser(@Body() body: unknown) {
    return firstValueFrom(
      this.employeeClient.send('employee-user-create', body)
    );
  }

  @Patch('users/:id')
  editUser(@Param('id') id: string, @Body() body: unknown) {
    return firstValueFrom(
      this.employeeClient.send('employee-user-edit', { id, data: body })
    );
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return firstValueFrom(
      this.employeeClient.send('employee-user-delete', id)
    );
  }

  @Post()
  createEmployee(@Body() body: unknown) {
    return firstValueFrom(this.employeeClient.send('employee-create', body));
  }

  @Patch(':id')
  editEmployee(@Param('id') id: string, @Body() body: unknown) {
    return firstValueFrom(
      this.employeeClient.send('employee-edit', { id, data: body })
    );
  }

  @Delete(':id')
  deleteEmployee(@Param('id') id: string) {
    return firstValueFrom(
      this.employeeClient.send('employee-delete', id)
    );
  }
}

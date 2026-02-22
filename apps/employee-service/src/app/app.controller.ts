import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Role management
  @MessagePattern('employee-roles-list')
  getRoles() {
    return this.appService.getRoles();
  }

  @MessagePattern('employee-assign-role')
  async assignRole(
    @Payload() payload: { employeeId: string; role: string }
  ) {
    return this.appService.assignRoleToEmployee(
      payload.employeeId,
      payload.role
    );
  }

  // User CRUD (roles not important)
  @MessagePattern('employee-user-create')
  async createUser(@Payload() payload: unknown) {
    return this.appService.createUser(payload as Parameters<AppService['createUser']>[0]);
  }

  @MessagePattern('employee-user-edit')
  async editUser(
    @Payload() payload: { id: string; data: unknown }
  ) {
    return this.appService.editUser(payload.id, payload.data as never);
  }

  @MessagePattern('employee-user-delete')
  async deleteUser(@Payload() id: string) {
    return this.appService.deleteUser(id);
  }

  // Employee CRUD (use Role when creating)
  @MessagePattern('employee-create')
  async createEmployee(@Payload() payload: unknown) {
    return this.appService.createEmployee(payload as Parameters<AppService['createEmployee']>[0]);
  }

  @MessagePattern('employee-edit')
  async editEmployee(
    @Payload() payload: { id: string; data: unknown }
  ) {
    return this.appService.editEmployee(payload.id, payload.data as never);
  }

  @MessagePattern('employee-delete')
  async deleteEmployee(@Payload() id: string) {
    return this.appService.deleteEmployee(id);
  }
}

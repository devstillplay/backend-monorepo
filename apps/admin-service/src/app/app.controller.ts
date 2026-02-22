import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // User management
  @MessagePattern('admin-users-list')
  async listUsers() {
    return this.appService.listUsers();
  }

  @MessagePattern('admin-users-get')
  async getUser(@Payload() id: string) {
    return this.appService.getUser(id);
  }

  @MessagePattern('admin-users-create')
  async createUser(@Payload() payload: unknown) {
    return this.appService.createUser(payload as Parameters<AppService['createUser']>[0]);
  }

  @MessagePattern('admin-users-update')
  async updateUser(@Payload() payload: { id: string; data: unknown }) {
    return this.appService.updateUser(payload.id, payload.data as never);
  }

  @MessagePattern('admin-users-delete')
  async deleteUser(@Payload() id: string) {
    return this.appService.deleteUser(id);
  }

  @MessagePattern('admin-users-verify')
  async verifyUser(@Payload() id: string) {
    return this.appService.verifyUser(id);
  }

  // Employee management
  @MessagePattern('admin-employees-list')
  async listEmployees() {
    return this.appService.listEmployees();
  }

  @MessagePattern('admin-employees-get')
  async getEmployee(@Payload() id: string) {
    return this.appService.getEmployee(id);
  }

  @MessagePattern('admin-employees-create')
  async createEmployee(@Payload() payload: unknown) {
    return this.appService.createEmployee(payload as Parameters<AppService['createEmployee']>[0]);
  }

  @MessagePattern('admin-employees-update')
  async updateEmployee(@Payload() payload: { id: string; data: unknown }) {
    return this.appService.updateEmployee(payload.id, payload.data as never);
  }

  @MessagePattern('admin-employees-delete')
  async deleteEmployee(@Payload() id: string) {
    return this.appService.deleteEmployee(id);
  }

  // Admin activity (id attached to user)
  @MessagePattern('admin-activity-create')
  async createActivity(@Payload() payload: { userId: string; action: string; ip?: string }) {
    return this.appService.createActivity(payload);
  }

  @MessagePattern('admin-activity-list')
  async listActivities(@Payload() payload: { userId: string; limit?: number }) {
    return this.appService.listActivitiesByUser(payload.userId, payload.limit);
  }
}

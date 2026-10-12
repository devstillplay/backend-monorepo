import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { MarketingService } from './marketing/marketing.service';
import type { MarketingSendPayload } from './marketing/marketing.service';
import { EventsService } from './events/events.service';
import type { EventRegisterPayload, WebinarInput } from './events/events.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly marketingService: MarketingService,
    private readonly eventsService: EventsService
  ) {}

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

  @MessagePattern('waitlist-create')
  async createWaitlistEntry(@Payload() payload: unknown) {
    return this.appService.createWaitlistEntry(payload as Parameters<AppService['createWaitlistEntry']>[0]);
  }

  @MessagePattern('waitlist-list')
  async listWaitlistEntries() {
    return this.appService.listWaitlistEntries();
  }

  @MessagePattern('blog-list')
  async listBlogPosts(@Payload() payload?: { publishedOnly?: boolean }) {
    return this.appService.listBlogPosts(payload);
  }

  @MessagePattern('blog-get-by-slug')
  async getBlogPostBySlug(
    @Payload() payload: { slug: string; publishedOnly?: boolean }
  ) {
    return this.appService.getBlogPostBySlug(payload.slug, {
      publishedOnly: payload.publishedOnly,
    });
  }

  @MessagePattern('blog-get-by-id')
  async getBlogPostById(@Payload() id: string) {
    return this.appService.getBlogPostById(id);
  }

  @MessagePattern('blog-create')
  async createBlogPost(@Payload() payload: unknown) {
    return this.appService.createBlogPost(
      payload as Parameters<AppService['createBlogPost']>[0]
    );
  }

  @MessagePattern('blog-update')
  async updateBlogPost(
    @Payload() payload: { id: string; data: unknown }
  ) {
    return this.appService.updateBlogPost(
      payload.id,
      payload.data as Parameters<AppService['updateBlogPost']>[1]
    );
  }

  @MessagePattern('blog-delete')
  async deleteBlogPost(@Payload() id: string) {
    return this.appService.deleteBlogPost(id);
  }

  @MessagePattern('marketing-preview-recipients')
  async previewMarketingRecipients(@Payload() payload: MarketingSendPayload) {
    return this.marketingService.previewRecipients(payload);
  }

  @MessagePattern('marketing-send')
  async sendMarketingEmail(@Payload() payload: MarketingSendPayload) {
    return this.marketingService.sendMarketing(payload);
  }

  @MessagePattern('marketing-send-history-list')
  async listMarketingSendHistory(@Payload() payload: { limit?: number }) {
    return this.marketingService.listSendHistory(payload?.limit);
  }

  @MessagePattern('marketing-send-history-get')
  async getMarketingSendHistory(@Payload() id: string) {
    return this.marketingService.getSendHistory(id);
  }

  @MessagePattern('event-register')
  async registerForEvent(@Payload() payload: EventRegisterPayload) {
    return this.eventsService.register(payload);
  }

  @MessagePattern('event-registrations-list')
  async listEventRegistrations(@Payload() payload: { eventSlug?: string }) {
    return this.eventsService.listRegistrations(payload?.eventSlug);
  }

  @MessagePattern('event-public-featured')
  async getFeaturedEvent() {
    return this.eventsService.getFeatured();
  }

  @MessagePattern('event-public-get')
  async getPublicEvent(@Payload() payload: { slug: string }) {
    return this.eventsService.getPublicBySlug(payload?.slug);
  }

  @MessagePattern('event-admin-list')
  async listEventsAdmin() {
    return this.eventsService.adminList();
  }

  @MessagePattern('event-admin-get')
  async getEventAdmin(@Payload() id: string) {
    return this.eventsService.adminGet(id);
  }

  @MessagePattern('event-admin-create')
  async createEvent(@Payload() payload: WebinarInput) {
    return this.eventsService.create(payload);
  }

  @MessagePattern('event-admin-update')
  async updateEvent(@Payload() payload: { id: string; data: WebinarInput }) {
    return this.eventsService.update(payload?.id, payload?.data);
  }

  @MessagePattern('event-admin-delete')
  async deleteEvent(@Payload() id: string) {
    return this.eventsService.remove(id);
  }
}

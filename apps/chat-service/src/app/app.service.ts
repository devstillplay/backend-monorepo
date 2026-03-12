import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '@my-workspace/prisma';
import { PusherService } from './pusher.service';

export const ChatSupportStatus = {
  OPEN: 'open',
  CLOSED: 'closed',
} as const;

export const SenderType = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
} as const;

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pusher: PusherService,
    @Inject('NOTIFICATION_SERVICE') private readonly notificationClient: ClientProxy,
  ) {}

  async createThread(userId: string) {
    const existing = await this.prisma.chatSupport.findFirst({
      where: { userId, status: ChatSupportStatus.OPEN },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { messages: true } } },
    });
    if (existing) return { thread: existing };
    const thread = await this.prisma.chatSupport.create({
      data: {
        userId,
        status: ChatSupportStatus.OPEN,
      },
    });
    return { thread };
  }

  async getThreads(payload?: { userId?: string; status?: string }) {
    const where: { userId?: string; status?: string } = {};
    if (payload?.userId) where.userId = payload.userId;
    if (payload?.status) where.status = payload.status;

    const threads = await this.prisma.chatSupport.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { messages: true } },
      },
    });
    return { threads };
  }

  async getMessages(chatSupportId: string, limit = 100) {
    const thread = await this.prisma.chatSupport.findUnique({
      where: { id: chatSupportId },
    });
    if (!thread) throw new NotFoundException('Chat thread not found');

    const messages = await this.prisma.chatMessage.findMany({
      where: { chatSupportId },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });
    return { messages };
  }

  async sendMessage(payload: {
    chatSupportId: string;
    senderType: 'customer' | 'admin';
    senderId: string;
    content: string;
    recipientUserId?: string;
  }) {
    const thread = await this.prisma.chatSupport.findUnique({
      where: { id: payload.chatSupportId },
    });
    if (!thread) throw new NotFoundException('Chat thread not found');

    // Admin MUST pass recipientUserId and thread must belong to that recipient
    if (payload.senderType === SenderType.ADMIN) {
      if (!payload.recipientUserId?.trim()) {
        throw new NotFoundException('Admin must pass recipientUserId when sending a message.');
      }
      const threadUserId = String(thread.userId);
      const recipientId = String(payload.recipientUserId.trim());
      if (threadUserId !== recipientId) {
        throw new NotFoundException(
          `Thread does not belong to recipient. Expected userId ${recipientId}, thread belongs to ${threadUserId}`,
        );
      }
    }

    const message = await this.prisma.chatMessage.create({
      data: {
        chatSupportId: payload.chatSupportId,
        senderType: payload.senderType,
        senderId: payload.senderId,
        content: payload.content,
      },
    });

    // Trigger Pusher event on channel "chat-{chatSupportId}"
    await this.pusher.trigger(payload.chatSupportId, 'new-message', {
      id: message.id,
      chatSupportId: message.chatSupportId,
      senderType: message.senderType,
      senderId: message.senderId,
      content: message.content,
      createdAt: message.createdAt,
    });

    // Send OneSignal push to recipient
    const pushPayload: {
      contents: string;
      headings: string;
      includeExternalIds?: string[];
      includedSegments?: string[];
      data: Record<string, string>;
    } = {
      contents: payload.content.length > 100 ? payload.content.slice(0, 97) + '...' : payload.content,
      headings: 'New chat message',
      data: {
        type: 'chat_message',
        chatSupportId: payload.chatSupportId,
        messageId: message.id,
      },
    };

    if (payload.senderType === SenderType.ADMIN) {
      pushPayload.includeExternalIds = [thread.userId];
    } else {
      // Customer sent – notify admin/support staff (OneSignal segment)
      pushPayload.includedSegments = ['Admin'];
    }

    try {
      await firstValueFrom(
        this.notificationClient.send('notification-send-push', pushPayload),
      );
    } catch (err) {
      // Log but don't fail – push is best-effort
      console.error('Failed to send push notification:', err);
    }

    return { message };
  }
}

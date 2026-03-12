import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from '../guards/auth/auth.guard';

export const CHAT_SERVICE = 'CHAT_SERVICE';

function handleChatError(err: unknown): never {
  const o = err && typeof err === 'object' ? (err as Record<string, unknown>) : {};
  const payload = (o.error ?? o.response ?? o) as Record<string, unknown> | undefined;
  const statusCode = Number(
    o.statusCode ?? payload?.statusCode ?? payload?.status ?? 500,
  );
  const message =
    typeof o.message === 'string'
      ? o.message
      : typeof payload?.message === 'string'
        ? payload.message
        : err instanceof Error
          ? err.message
          : 'Chat service error';
  throw new HttpException(
    Array.isArray(message) ? message[0] : message,
    statusCode >= 400 && statusCode < 600 ? statusCode : 500,
  );
}

@Controller('chat')
export class ChatController {
  constructor(
    @Inject(CHAT_SERVICE) private readonly chatClient: ClientProxy,
  ) {}

  /** Create a support thread. Customer: for self. Admin: must pass userId in body for the customer (cannot create for self). */
  @Post('threads')
  @UseGuards(AuthGuard)
  async createThread(
    @Req() req: Request & { user?: { id: string; role?: string } },
    @Body() body?: { userId?: string },
  ) {
    const currentUserId = req.user?.id;
    if (!currentUserId) throw new HttpException('Unauthorized', 401);
    const isAdmin = req.user?.role === 'Super Admin' || req.user?.role === 'Customer Support' || req.user?.role === 'Finance';
    if (isAdmin && !body?.userId?.trim()) {
      throw new HttpException('Admin must pass userId in body (the customer to chat with).', 400);
    }
    const targetUserId = isAdmin && body?.userId ? body.userId.trim() : currentUserId;
    if (isAdmin && String(targetUserId) === String(currentUserId)) {
      throw new HttpException('Admin cannot create a support thread for themselves. Pass the customer userId.', 400);
    }
    try {
      return await firstValueFrom(
        this.chatClient.send('chat-create-thread', { userId: targetUserId }),
      );
    } catch (err) {
      handleChatError(err);
    }
  }

  /** Get threads – customers see their own; admins can filter by userId or status. */
  @Get('threads')
  @UseGuards(AuthGuard)
  async getThreads(
    @Req() req: Request & { user?: { id: string; role?: string } },
    @Query('userId') userId?: string,
    @Query('status') status?: string,
  ) {
    const currentUserId = req.user?.id;
    if (!currentUserId) throw new HttpException('Unauthorized', 401);
    const isAdmin = req.user?.role === 'Super Admin' || req.user?.role === 'Customer Support' || req.user?.role === 'Finance';
    const filterUserId = userId ?? (isAdmin ? undefined : currentUserId);
    try {
      return await firstValueFrom(
        this.chatClient.send('chat-get-threads', { userId: filterUserId, status }),
      );
    } catch (err) {
      handleChatError(err);
    }
  }

  /** Get messages for a thread. */
  @Get('threads/:chatSupportId/messages')
  @UseGuards(AuthGuard)
  async getMessages(
    @Param('chatSupportId') chatSupportId: string,
    @Query('limit') limit?: string,
  ) {
    try {
      return await firstValueFrom(
        this.chatClient.send('chat-get-messages', {
          chatSupportId,
          limit: limit != null ? parseInt(limit, 10) : undefined,
        }),
      );
    } catch (err) {
      handleChatError(err);
    }
  }

  /** Send a message. senderType and senderId derived from auth when not provided. */
  @Post('messages')
  @UseGuards(AuthGuard)
  async sendMessage(
    @Req() req: Request & { user?: { id: string; role?: string } },
    @Body()
    body: {
      chatSupportId: string;
      recipientUserId?: string;
      senderType?: 'customer' | 'admin';
      senderId?: string;
      content: string;
    },
  ) {
    if (!body?.chatSupportId || !body?.content?.trim()) {
      throw new HttpException('chatSupportId and content are required', 400);
    }
    const userId = req.user?.id;
    if (!userId) throw new HttpException('Unauthorized', 401);
    const isAdmin = req.user?.role === 'Super Admin' || req.user?.role === 'Customer Support' || req.user?.role === 'Finance';
    // Admin MUST pass recipientUserId (the customer) so message goes to the correct thread
    if (isAdmin && (!body?.recipientUserId || !body.recipientUserId.trim())) {
      throw new HttpException('Admin must pass recipientUserId (the customer to send to).', 400);
    }
    if (isAdmin && String(body.recipientUserId?.trim()) === String(userId)) {
      throw new HttpException('Admin cannot send to themselves. Pass the customer recipientUserId.', 400);
    }
    const senderType = body.senderType ?? (isAdmin ? 'admin' : 'customer');
    const senderId = body.senderId ?? userId;
    try {
      return await firstValueFrom(
        this.chatClient.send('chat-send-message', {
          chatSupportId: body.chatSupportId,
          recipientUserId: body.recipientUserId?.trim(),
          senderType,
          senderId,
          content: body.content.trim(),
        }),
      );
    } catch (err) {
      handleChatError(err);
    }
  }
}

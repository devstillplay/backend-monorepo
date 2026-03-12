import { BadRequestException, Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('chat-create-thread')
  createThread(@Payload() payload: string | { userId?: string }) {
    const userId = typeof payload === 'string' ? payload : payload?.userId;
    if (!userId || typeof userId !== 'string') {
      throw new BadRequestException('createThread requires userId (string)');
    }
    return this.appService.createThread(userId);
  }

  @MessagePattern('chat-send-message')
  sendMessage(
    @Payload()
    payload: {
      chatSupportId: string;
      senderType: 'customer' | 'admin';
      senderId: string;
      content: string;
      recipientUserId?: string;
    },
  ) {
    return this.appService.sendMessage(payload);
  }

  @MessagePattern('chat-get-threads')
  getThreads(
    @Payload() payload?: { userId?: string; status?: string },
  ) {
    return this.appService.getThreads(payload);
  }

  @MessagePattern('chat-get-messages')
  getMessages(
    @Payload() payload: { chatSupportId: string; limit?: number },
  ) {
    return this.appService.getMessages(
      payload.chatSupportId,
      payload.limit ?? 100,
    );
  }
}

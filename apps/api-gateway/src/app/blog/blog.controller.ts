import { Controller, Get, Inject, NotFoundException, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { rethrowAdminMicroserviceError } from '../utils/microservice-error';

@Controller('blog')
export class BlogController {
  constructor(
    @Inject('ADMIN_SERVICE') private readonly adminClient: ClientProxy
  ) {}

  @Get()
  async listPublished() {
    try {
      return await firstValueFrom(
        this.adminClient.send('blog-list', { publishedOnly: true })
      );
    } catch (err) {
      rethrowAdminMicroserviceError(err);
    }
  }

  @Get(':slug')
  async getBySlug(@Param('slug') slug: string) {
    if (!slug?.trim()) {
      throw new NotFoundException('Blog post not found');
    }
    try {
      return await firstValueFrom(
        this.adminClient.send('blog-get-by-slug', {
          slug: slug.trim(),
          publishedOnly: true,
        })
      );
    } catch (err) {
      rethrowAdminMicroserviceError(err);
    }
  }
}

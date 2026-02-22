import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

export const FILE_SERVICE = 'FILE_SERVICE';

/** Multer file shape (avoids relying on Express.Multer global) */
interface MulterFile {
  buffer?: Buffer;
  mimetype?: string;
  originalname?: string;
}

@Controller('files')
export class FileController {
  constructor(@Inject(FILE_SERVICE) private readonly fileClient: ClientProxy) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: MulterFile | undefined,
    @Body() body: { folder?: string; publicId?: string },
  ) {
    if (!file?.buffer) {
      throw new BadRequestException('file is required (multipart/form-data field "file")');
    }
    const fileBase64 = file.buffer.toString('base64');
    const result = await firstValueFrom(
      this.fileClient.send('file-upload', {
        fileBase64,
        folder: body?.folder,
        publicId: body?.publicId,
      })
    );
    if (result && typeof result === 'object' && 'error' in result) {
      throw new BadRequestException((result as { error: string }).error);
    }
    return result as { url: string; secureUrl: string; publicId?: string };
  }
}

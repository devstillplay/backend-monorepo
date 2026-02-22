import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

export interface UploadPayload {
  /** Base64-encoded file data (with or without data URL prefix) */
  fileBase64: string;
  /** Optional folder in Cloudinary (e.g. "stillplay/avatars") */
  folder?: string;
  /** Optional public_id for the asset */
  publicId?: string;
}

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private configured = false;

  constructor(private readonly config: ConfigService) {
    const cloudName = config.get('CLOUDINARY_CLOUD_NAME');
    const apiKey = config.get('CLOUDINARY_API_KEY');
    const apiSecret = config.get('CLOUDINARY_API_SECRET');
    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
      this.configured = true;
    } else {
      this.logger.warn('Cloudinary not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.');
    }
  }

  async upload(payload: UploadPayload): Promise<{ url: string; secureUrl: string; publicId?: string } | { error: string }> {
    if (!this.configured) {
      return { error: 'File upload not configured' };
    }
    let dataUri = payload.fileBase64;
    if (!dataUri.startsWith('data:')) {
      dataUri = `data:application/octet-stream;base64,${dataUri}`;
    }
    try {
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: payload.folder ?? 'stillplay',
        public_id: payload.publicId,
      });
      this.logger.log(`Uploaded: ${result.public_id}`);
      return {
        url: result.secure_url,
        secureUrl: result.secure_url,
        publicId: result.public_id,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Upload failed: ${message}`);
      return { error: message };
    }
  }
}

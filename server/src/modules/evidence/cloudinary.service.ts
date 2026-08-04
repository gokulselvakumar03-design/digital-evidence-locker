import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { config } from '../../config/env.config.js';
import { ApiError } from '../../utils/apiError.js';

/**
 * Cloudinary Media Storage Integration Service
 * Path: server/src/modules/evidence/cloudinary.service.ts
 * Purpose: Handles uploading evidence files to Cloudinary, generating thumbnails, and file deletion.
 */

// Initialize Cloudinary configuration
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

export interface CloudinaryUploadResult {
  storageUrl: string;
  publicId: string;
  thumbnailUrl: string | null;
}

export class CloudinaryService {
  /**
   * Uploads a file buffer to Cloudinary storage.
   * Falls back gracefully if Cloudinary credentials are not configured in dev mode.
   */
  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    folder = 'digital_evidence'
  ): Promise<CloudinaryUploadResult> {
    const isCloudinaryConfigured =
      config.cloudinary.cloudName &&
      config.cloudinary.apiKey &&
      config.cloudinary.apiSecret;

    if (!isCloudinaryConfigured) {
      // Fallback for development without Cloudinary credentials configured
      const mockPublicId = `${folder}/${Date.now()}_${fileName.replace(/\s+/g, '_')}`;
      const mockStorageUrl = `https://res.cloudinary.com/demo/raw/upload/${mockPublicId}`;
      const isImage = mimeType.startsWith('image/');
      const mockThumbnailUrl = isImage
        ? `https://res.cloudinary.com/demo/image/upload/c_thumb,w_200,g_face/${mockPublicId}`
        : null;

      return {
        storageUrl: mockStorageUrl,
        publicId: mockPublicId,
        thumbnailUrl: mockThumbnailUrl,
      };
    }

    const resourceType = this.determineResourceType(mimeType);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          public_id: `${Date.now()}_${fileName.replace(/\.[^/.]+$/, '')}`,
          overwrite: false,
        },
        (error: any, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            return reject(
              new ApiError(500, `Cloudinary upload failed: ${error?.message || 'Unknown error'}`)
            );
          }

          const thumbnailUrl = this.generateThumbnail(result.public_id, result.resource_type);

          resolve({
            storageUrl: result.secure_url,
            publicId: result.public_id,
            thumbnailUrl,
          });
        }
      );

      uploadStream.end(fileBuffer);
    });
  }

  /**
   * Deletes a file from Cloudinary using its public ID.
   */
  async deleteFile(publicId: string, resourceType: 'image' | 'video' | 'raw' | 'auto' = 'auto'): Promise<boolean> {
    const isCloudinaryConfigured =
      config.cloudinary.cloudName &&
      config.cloudinary.apiKey &&
      config.cloudinary.apiSecret;

    if (!isCloudinaryConfigured) {
      return true;
    }

    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
      return result.result === 'ok' || result.result === 'not found';
    } catch (error: any) {
      throw new ApiError(500, `Cloudinary file deletion failed: ${error?.message || 'Unknown error'}`);
    }
  }

  /**
   * Generates a thumbnail URL for images or videos.
   */
  generateThumbnail(publicId: string, resourceType = 'image'): string | null {
    if (resourceType === 'image') {
      return cloudinary.url(publicId, {
        width: 300,
        height: 300,
        crop: 'fill',
        format: 'jpg',
        secure: true,
      });
    }

    if (resourceType === 'video') {
      return cloudinary.url(publicId, {
        resource_type: 'video',
        width: 300,
        height: 300,
        crop: 'fill',
        format: 'jpg',
        secure: true,
      });
    }

    return null;
  }

  /**
   * Helper method to determine Cloudinary resource_type from MIME type.
   */
  private determineResourceType(mimeType: string): 'image' | 'video' | 'raw' {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/') || mimeType.startsWith('audio/')) return 'video';
    return 'raw';
  }
}

export const cloudinaryService = new CloudinaryService();

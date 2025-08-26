import { Injectable, Logger } from '@nestjs/common';
import sharp from 'sharp';

export interface ThumbnailVariant {
  name: string;
  width: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export interface ThumbnailResult {
  variantName: string;
  buffer: Buffer;
  width: number;
  height: number;
  size: number;
  format: string;
}

@Injectable()
export class ImageProcessingService {
  private readonly logger = new Logger(ImageProcessingService.name);

  private readonly defaultVariants: ThumbnailVariant[] = [
    { name: 'thumb_sm', width: 150, height: 150, quality: 80, format: 'jpeg' },
    { name: 'thumb_md', width: 300, height: 300, quality: 85, format: 'jpeg' },
    { name: 'thumb_lg', width: 600, height: 600, quality: 90, format: 'jpeg' },
    { name: 'webp_sm', width: 150, height: 150, quality: 80, format: 'webp' },
    { name: 'webp_md', width: 300, height: 300, quality: 85, format: 'webp' },
  ];

  /**
   * Generate multiple thumbnail variants for an image
   */
  async generateThumbnails(imageBuffer: Buffer, variants: ThumbnailVariant[] = this.defaultVariants): Promise<ThumbnailResult[]> {
    this.logger.debug(`Generating ${variants.length} thumbnail variants`);

    const results: ThumbnailResult[] = [];

    try {
      // Get original image metadata
      const metadata = await sharp(imageBuffer).metadata();
      this.logger.debug(`Original image: ${metadata.width}x${metadata.height}, format: ${metadata.format}`);

      for (const variant of variants) {
        try {
          const result = await this.generateSingleThumbnail(imageBuffer, variant);
          results.push(result);
          this.logger.debug(`Generated thumbnail ${variant.name}: ${result.width}x${result.height}`);
        } catch (error) {
          this.logger.error(`Failed to generate thumbnail ${variant.name}:`, error);
          // Continue with other variants
        }
      }
    } catch (error) {
      this.logger.error('Failed to process image for thumbnails:', error);
      throw new Error('Invalid image format or corrupted image');
    }

    return results;
  }

  /**
   * Generate a single thumbnail variant
   */
  async generateSingleThumbnail(imageBuffer: Buffer, variant: ThumbnailVariant): Promise<ThumbnailResult> {
    let sharpInstance = sharp(imageBuffer);

    // Resize image
    if (variant.height) {
      sharpInstance = sharpInstance.resize(variant.width, variant.height, {
        fit: 'cover',
        position: 'center',
      });
    } else {
      sharpInstance = sharpInstance.resize(variant.width, null, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // Set format and quality
    const format = variant.format || 'jpeg';
    const quality = variant.quality || 85;

    switch (format) {
      case 'jpeg':
        sharpInstance = sharpInstance.jpeg({ quality, progressive: true });
        break;
      case 'png':
        sharpInstance = sharpInstance.png({ quality });
        break;
      case 'webp':
        sharpInstance = sharpInstance.webp({ quality });
        break;
    }

    // Generate the thumbnail
    const outputBuffer = await sharpInstance.toBuffer();
    const outputMetadata = await sharp(outputBuffer).metadata();

    return {
      variantName: variant.name,
      buffer: outputBuffer,
      width: outputMetadata.width,
      height: outputMetadata.height,
      size: outputBuffer.length,
      format: outputMetadata.format,
    };
  }

  /**
   * Optimize an image without resizing
   */
  async optimizeImage(imageBuffer: Buffer, format?: 'jpeg' | 'png' | 'webp', quality = 85): Promise<Buffer> {
    this.logger.debug(`Optimizing image with format: ${format}, quality: ${quality}`);

    try {
      let sharpInstance = sharp(imageBuffer);

      if (format) {
        switch (format) {
          case 'jpeg':
            sharpInstance = sharpInstance.jpeg({ quality, progressive: true });
            break;
          case 'png':
            sharpInstance = sharpInstance.png({ quality });
            break;
          case 'webp':
            sharpInstance = sharpInstance.webp({ quality });
            break;
        }
      }

      return await sharpInstance.toBuffer();
    } catch (error) {
      this.logger.error('Failed to optimize image:', error);
      throw new Error('Failed to optimize image');
    }
  }

  /**
   * Extract image metadata
   */
  async extractImageMetadata(imageBuffer: Buffer): Promise<{
    width: number;
    height: number;
    format: string;
    size: number;
    hasAlpha: boolean;
    colorSpace?: string;
    density?: number;
  }> {
    try {
      const metadata = await sharp(imageBuffer).metadata();

      return {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: imageBuffer.length,
        hasAlpha: metadata.hasAlpha || false,
        colorSpace: metadata.space,
        density: metadata.density,
      };
    } catch (error) {
      this.logger.error('Failed to extract image metadata:', error);
      throw new Error('Invalid image format');
    }
  }

  /**
   * Validate if buffer contains a valid image
   */
  async isValidImage(buffer: Buffer): Promise<boolean> {
    try {
      await sharp(buffer).metadata();

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Convert image to a specific format
   */
  async convertFormat(imageBuffer: Buffer, targetFormat: 'jpeg' | 'png' | 'webp', quality = 85): Promise<Buffer> {
    this.logger.debug(`Converting image to ${targetFormat}`);

    try {
      let sharpInstance = sharp(imageBuffer);

      switch (targetFormat) {
        case 'jpeg':
          sharpInstance = sharpInstance.jpeg({ quality, progressive: true });
          break;
        case 'png':
          sharpInstance = sharpInstance.png({ quality });
          break;
        case 'webp':
          sharpInstance = sharpInstance.webp({ quality });
          break;
      }

      return await sharpInstance.toBuffer();
    } catch (error) {
      this.logger.error(`Failed to convert image to ${targetFormat}:`, error);
      throw new Error(`Failed to convert image to ${targetFormat}`);
    }
  }

  /**
   * Generate a blur placeholder for progressive loading
   */
  async generateBlurPlaceholder(imageBuffer: Buffer): Promise<Buffer> {
    try {
      return await sharp(imageBuffer).resize(20, 20, { fit: 'inside' }).blur(1).jpeg({ quality: 30 }).toBuffer();
    } catch (error) {
      this.logger.error('Failed to generate blur placeholder:', error);
      throw new Error('Failed to generate blur placeholder');
    }
  }
}

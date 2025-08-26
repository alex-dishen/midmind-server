import { Injectable, Logger } from '@nestjs/common';
import { FileCategory } from 'src/db/types/db.types';
import * as mimeTypes from 'mime-types';
import * as crypto from 'crypto';

export interface FileMetadata {
  category: FileCategory;
  mimeType: string;
  extension: string | null;
  width?: number;
  height?: number;
  durationMs?: number;
  pages?: number;
  metadata?: Record<string, unknown>;
}

export interface ProcessingResult {
  metadata: FileMetadata;
  contentHash?: string;
  virusScanResult?: VirusScanResult;
  thumbnails?: ThumbnailInfo[];
}

export interface VirusScanResult {
  status: 'clean' | 'infected' | 'unknown';
  details?: string;
  scannedAt: Date;
}

export interface ThumbnailInfo {
  variantName: string;
  width: number;
  height: number;
  mimeType: string;
  size: number;
}

@Injectable()
export class FileProcessingService {
  private readonly logger = new Logger(FileProcessingService.name);

  /**
   * Determine file category based on MIME type and extension
   */
  categorizeFile(filename: string, mimeType?: string): FileCategory {
    const extension = this.getFileExtension(filename);
    const detectedMimeType = mimeType || mimeTypes.lookup(filename) || 'application/octet-stream';

    // Image files
    if (detectedMimeType.startsWith('image/')) {
      return FileCategory.IMAGE;
    }

    // Document files
    if (
      detectedMimeType.includes('pdf') ||
      detectedMimeType.includes('document') ||
      detectedMimeType.includes('text') ||
      detectedMimeType.includes('spreadsheet') ||
      detectedMimeType.includes('presentation') ||
      ['doc', 'docx', 'pdf', 'txt', 'rtf', 'odt', 'xls', 'xlsx', 'ppt', 'pptx'].includes(extension || '')
    ) {
      return FileCategory.DOCUMENT;
    }

    throw new Error(`Unknown file category for ${filename}`);

    // // Audio files
    // if (detectedMimeType.startsWith('audio/') || ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'].includes(extension || '')) {
    //   return FileCategory.AUDIO;
    // }

    // // Video files
    // if (detectedMimeType.startsWith('video/') || ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'].includes(extension || '')) {
    //   return FileCategory.VIDEO;
    // }

    // // Archive files
    // if (
    //   detectedMimeType.includes('zip') ||
    //   detectedMimeType.includes('tar') ||
    //   detectedMimeType.includes('rar') ||
    //   ['zip', 'tar', 'gz', 'rar', '7z', 'bz2'].includes(extension || '')
    // ) {
    //   return FileCategory.ARCHIVE;
    // }

    // return FileCategory.OTHER;
  }

  /**
   * Generate SHA-256 hash from buffer
   */
  generateContentHash(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  /**
   * Generate SHA-256 hash from stream
   */
  async generateContentHashFromStream(stream: NodeJS.ReadableStream): Promise<string> {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash('sha256');

      stream.on('data', (chunk: Buffer) => {
        hash.update(chunk);
      });

      stream.on('end', () => {
        resolve(hash.digest('hex'));
      });

      stream.on('error', error => {
        reject(error instanceof Error ? error : new Error(String(error)));
      });
    });
  }

  /**
   * Extract basic metadata from file
   */
  extractBasicMetadata(filename: string, mimeType?: string, buffer?: Buffer): FileMetadata {
    const extension = this.getFileExtension(filename);
    const detectedMimeType = mimeType || mimeTypes.lookup(filename) || 'application/octet-stream';
    const category = this.categorizeFile(filename, detectedMimeType);

    const metadata: FileMetadata = {
      category,
      mimeType: detectedMimeType,
      extension,
    };

    // If we have buffer, we can extract more detailed metadata
    if (buffer) {
      this.extractDetailedMetadata(metadata, buffer);
    }

    return metadata;
  }

  /**
   * Extract detailed metadata based on file type
   */
  private extractDetailedMetadata(metadata: FileMetadata, buffer: Buffer): void {
    try {
      switch (metadata.category) {
        case FileCategory.IMAGE:
          this.extractImageMetadata(metadata, buffer);
          break;
        // case FileCategory.AUDIO:
        //   await this.extractAudioMetadata(metadata);
        //   break;
        // case FileCategory.VIDEO:
        //   await this.extractVideoMetadata(metadata);
        //   break;
        // case FileCategory.DOCUMENT:
        //   await this.extractDocumentMetadata(metadata);
        //   break;
        default:
          // For other file types, no additional metadata extraction
          break;
      }
    } catch (error) {
      this.logger.warn(`Failed to extract detailed metadata for ${metadata.category} file`, error);
    }
  }

  /**
   * Extract image metadata (basic implementation without external dependencies)
   */
  private extractImageMetadata(metadata: FileMetadata, buffer: Buffer): void {
    // Basic image metadata extraction
    // In a real implementation, you'd use libraries like 'sharp', 'jimp', or 'image-size'

    // For now, we'll implement basic JPEG/PNG dimension detection
    try {
      if (metadata.mimeType === 'image/jpeg') {
        const dimensions = this.getJpegDimensions(buffer);

        if (dimensions) {
          metadata.width = dimensions.width;
          metadata.height = dimensions.height;
        }
      } else if (metadata.mimeType === 'image/png') {
        const dimensions = this.getPngDimensions(buffer);

        if (dimensions) {
          metadata.width = dimensions.width;
          metadata.height = dimensions.height;
        }
      }
    } catch (error) {
      this.logger.warn('Failed to extract image dimensions', error);
    }
  }

  /**
   * Extract audio metadata (placeholder)
   */
  // private extractAudioMetadata(metadata: FileMetadata): void {
  //   // In a real implementation, you'd use libraries like 'music-metadata'
  //   // For now, this is a placeholder
  //   metadata.metadata = {
  //     audioType: 'audio',
  //   };
  // }

  /**
   * Extract video metadata (placeholder)
   */
  // private extractVideoMetadata(metadata: FileMetadata): void {
  //   // In a real implementation, you'd use FFmpeg or similar tools
  //   // For now, this is a placeholder
  //   metadata.metadata = {
  //     videoType: 'video',
  //   };
  // }

  /**
   * Extract document metadata (placeholder)
   */
  // private extractDocumentMetadata(metadata: FileMetadata): void {
  //   // In a real implementation, you'd use libraries like 'pdf-parse' for PDFs
  //   // For now, this is a placeholder
  //   metadata.metadata = {
  //     documentType: 'document',
  //   };
  // }

  /**
   * Simple virus scan (placeholder implementation)
   */
  performVirusScan(buffer: Buffer): VirusScanResult {
    // In a real implementation, you'd integrate with ClamAV, VirusTotal API, etc.
    // For now, perform basic checks

    // Basic check for suspicious file signatures
    const headerBytes = buffer.subarray(0, 1024);
    const headerString = headerBytes.toString('ascii', 0, Math.min(100, headerBytes.length));

    // Check for executable signatures
    if (headerString.includes('MZ') || headerString.includes('PE')) {
      return {
        status: 'unknown',
        details: 'Executable file detected, manual review recommended',
        scannedAt: new Date(),
      };
    }

    return {
      status: 'clean',
      scannedAt: new Date(),
    };
  }

  /**
   * Check if file should be quarantined based on scan result
   */
  shouldQuarantine(scanResult: VirusScanResult): boolean {
    return scanResult.status === 'infected';
  }

  /**
   * Get file extension from filename
   */
  private getFileExtension(filename: string): string | null {
    const match = filename.match(/\.([^.]+)$/);

    return match ? match[1].toLowerCase() : null;
  }

  /**
   * Basic JPEG dimension extraction
   */
  private getJpegDimensions(buffer: Buffer): { width: number; height: number } | null {
    try {
      // Look for SOF0 (Start of Frame) marker
      for (let i = 0; i < buffer.length - 9; i++) {
        if (buffer[i] === 0xff && buffer[i + 1] === 0xc0) {
          const height = buffer.readUInt16BE(i + 5);
          const width = buffer.readUInt16BE(i + 7);

          return { width, height };
        }
      }
    } catch {
      // Ignore errors in dimension extraction
    }

    return null;
  }

  /**
   * Basic PNG dimension extraction
   */
  private getPngDimensions(buffer: Buffer): { width: number; height: number } | null {
    try {
      // PNG files start with specific signature
      if (buffer.length >= 24 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
        // IHDR chunk contains dimensions at bytes 16-23
        const width = buffer.readUInt32BE(16);
        const height = buffer.readUInt32BE(20);

        return { width, height };
      }
    } catch {
      // Ignore errors in dimension extraction
    }

    return null;
  }

  /**
   * Validate file size against limits
   */
  validateFileSize(sizeBytes: number, category: FileCategory): boolean {
    const limits = {
      [FileCategory.IMAGE]: 50 * 1024 * 1024, // 50MB
      [FileCategory.DOCUMENT]: 100 * 1024 * 1024, // 100MB
      // [FileCategory.AUDIO]: 200 * 1024 * 1024, // 200MB
      // [FileCategory.VIDEO]: 500 * 1024 * 1024, // 500MB
      // [FileCategory.ARCHIVE]: 100 * 1024 * 1024, // 100MB
      // [FileCategory.OTHER]: 50 * 1024 * 1024, // 50MB
    };

    return sizeBytes <= limits[category];
  }

  /**
   * Check if file type is allowed
   */
  isFileTypeAllowed(mimeType: string, filename: string): boolean {
    const allowedMimeTypes = [
      // Images
      'image/jpeg',
      'image/png',
      // 'image/gif',
      'image/webp',
      // 'image/svg+xml',
      // 'image/bmp',
      // 'image/tiff',

      // Documents
      // 'application/pdf',
      // 'text/plain',
      // 'text/csv',
      // 'application/msword',
      // 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      // 'application/vnd.ms-excel',
      // 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      // 'application/vnd.ms-powerpoint',
      // 'application/vnd.openxmlformats-officedocument.presentationml.presentation',

      // Archives
      // 'application/zip',
      // 'application/x-tar',
      // 'application/gzip',
      // 'application/x-rar-compressed',

      // Audio
      // 'audio/mpeg',
      // 'audio/wav',
      // 'audio/flac',
      // 'audio/aac',
      // 'audio/ogg',

      // Video
      // 'video/mp4',
      // 'video/avi',
      // 'video/quicktime',
      // 'video/webm',
    ];

    const blockedExtensions = ['exe', 'bat', 'cmd', 'scr', 'vbs', 'js', 'jar', 'com', 'pif', 'application'];

    const extension = this.getFileExtension(filename);

    if (extension && blockedExtensions.includes(extension)) {
      return false;
    }

    return allowedMimeTypes.includes(mimeType) || mimeType.startsWith('text/');
  }
}

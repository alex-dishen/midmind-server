import { randomUUID } from 'crypto';
import { FileRepository } from './file.repository';
import { FileCreateDto } from './dto/create-file.dto';
import { FileUpdateDto } from './dto/update-file.dto';
import { FileStatus } from 'src/db/types/db.types';
import { CreateFileRecordOutput, GetFileOutput } from './types/file.service.types';
import { FileProcessingService } from './services/file-processing.service';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { S3Service } from 'src/shared/services/aws/s3/s3.service';

@Injectable()
export class FileService {
  constructor(
    private s3Service: S3Service,
    private fileRepository: FileRepository,
    private fileProcessingService: FileProcessingService,
  ) {}

  async createFileRecord(userId: string, dto: FileCreateDto): Promise<CreateFileRecordOutput> {
    const fileId = randomUUID();

    if (!this.fileProcessingService.isFileTypeAllowed(dto.mime_type, dto.original_filename)) {
      throw new BadRequestException('File type not allowed');
    }

    const category = this.fileProcessingService.categorizeFile(dto.original_filename, dto.mime_type);

    if (!this.fileProcessingService.validateFileSize(dto.size_bytes, category)) {
      throw new BadRequestException('File size exceeds limit for this file type');
    }

    const s3Key = this.s3Service.generateFileKey(fileId, dto.original_filename);

    const file = await this.fileRepository.createFile({
      category,
      id: fileId,
      object_key: s3Key,
      uploader_id: userId,
      extension: dto.extension,
      mime_type: dto.mime_type,
      status: FileStatus.PENDING_UPLOAD,
      size_bytes: BigInt(dto.size_bytes),
      original_filename: dto.original_filename,
      bucket: this.s3Service.getDefaultBucket(),
    });

    const uploadUrl = await this.s3Service.generateUploadUrl({
      key: s3Key,
      expiresIn: 600, // 10 minutes
      bucket: file.bucket,
      contentType: dto.mime_type,
      contentLength: dto.size_bytes,
    });

    return {
      uploadUrl,
      fileId: file.id,
    };
  }

  async updateFile(fileId: string, data: FileUpdateDto): Promise<void> {
    const file = await this.fileRepository.getFileById(fileId);

    if (!file) {
      throw new NotFoundException('File not found');
    }

    if (file.status !== FileStatus.PENDING_UPLOAD) {
      throw new BadRequestException('File is not in pending upload state');
    }

    const objectInfo = await this.s3Service.getObjectInfo(file.object_key, file.bucket);

    if (!objectInfo.exists) {
      throw new BadRequestException('File was not uploaded to S3');
    }

    await this.fileRepository.updateFile(fileId, {
      status: data.status,
      size_bytes: objectInfo.size ? BigInt(objectInfo.size) : file.size_bytes,
    });
  }

  async getFileById(fileId: string): Promise<GetFileOutput> {
    const file = await this.fileRepository.getFileById(fileId);

    if (!file) {
      throw new NotFoundException('File is not found');
    }

    const downloadUrl = await this.s3Service.generateDownloadUrl({
      bucket: file.bucket,
      key: file.object_key,
      expiresIn: 3600, // 60 minutes
    });

    return { id: file.id, download_url: downloadUrl, file_name: file.original_filename };
  }
}

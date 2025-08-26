import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { FileRepository } from '../file.repository';
import { S3Service } from '../../../shared/services/aws/s3/s3.service';
import { FileStatus } from 'src/db/types/db.types';
import { FileUploadJob, QueueList } from 'src/shared/enums/bull-queues';
import { CleanupAbandonedUploadJobArgs, FileUploadProcessJobs } from '../types/file-upload.processor.types';

@Processor(QueueList.FILE_UPLOAD)
export class FileUploadProcessor extends WorkerHost {
  private readonly logger = new Logger(FileUploadProcessor.name);

  constructor(
    private fileRepository: FileRepository,
    private s3Service: S3Service,
  ) {
    super();
  }

  async process(job: FileUploadProcessJobs): Promise<void> {
    switch (job.name) {
      case FileUploadJob.CLEANUP_ABANDONED_UPLOADS:
        await this.cleanupAbandonedUpload(job.data);
        break;
    }
  }

  private async cleanupAbandonedUpload({ object_key, bucket, fileId }: CleanupAbandonedUploadJobArgs): Promise<void> {
    this.logger.debug('Cleaning up abandoned uploads');

    try {
      // Check if file was actually uploaded to S3
      const objectInfo = await this.s3Service.getObjectInfo(object_key, bucket);

      if (objectInfo.exists) {
        // File exists in S3 but database status is still pending
        // This might be a finalization failure - mark as uploaded
        await this.fileRepository.updateFile(fileId, { status: FileStatus.UPLOADED });
        this.logger.debug(`Updated orphaned file ${fileId} to uploaded status`);
      } else {
        // File doesn't exist in S3, clean up database record
        await this.fileRepository.deleteFile(fileId);
        this.logger.debug(`Cleaned up abandoned upload ${fileId}`);
      }
    } catch (error) {
      this.logger.error(`Failed to process abandoned file ${fileId}:`, error);
    }
  }
}

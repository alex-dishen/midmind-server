import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { FileService } from './file.service';
import { S3Service } from '../../shared/services/aws/s3/s3.service';
import { FileController } from './file.controller';
import { FileRepository } from './file.repository';
import { BullBackoffOptions, QueueList } from 'src/shared/enums/bull-queues';
import { FileSchedulerService } from './services/file-scheduler.service';
import { FileUploadProcessor } from './processors/file-upload.processor';
import { FileProcessingService } from './services/file-processing.service';
import { ImageProcessingService } from './services/image-processing.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueList.FILE_UPLOAD,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: BullBackoffOptions.EXPONENTIAL,
          delay: 2000,
        },
      },
    }),
  ],
  controllers: [FileController],
  providers: [
    FileService,
    FileRepository,
    S3Service,
    FileProcessingService,
    ImageProcessingService,
    FileSchedulerService,
    FileUploadProcessor,
  ],
})
export class FileModule {}

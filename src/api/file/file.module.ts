import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { FileService } from './files/file.service';
import { S3Service } from '../../shared/services/aws/s3/s3.service';
import { FileController } from './files/file.controller';
import { FileRepository } from './files/file.repository';
import { BullBackoffOptions, QueueList } from 'src/shared/enums/bull-queues';
import { FileSchedulerService } from './files/services/file-scheduler.service';
import { FileUploadProcessor } from './files/processors/file-upload.processor';
import { FileProcessingService } from './files/services/file-processing.service';
import { ImageProcessingService } from './files/services/image-processing.service';
import { FileBindingsRepository } from './file-bindings/file-bindings.repository';

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
    FileBindingsRepository,
  ],
  exports: [FileBindingsRepository],
})
export class FileModule {}

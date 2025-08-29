import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FileUploadJob, QueueList } from 'src/shared/enums/bull-queues';
import { FileRepository } from '../file.repository';
import { FileStatus } from 'src/db/types/db.types';

@Injectable()
export class FileSchedulerService implements OnModuleInit {
  private readonly logger = new Logger(FileSchedulerService.name);

  constructor(
    @InjectQueue(QueueList.FILE_UPLOAD) private fileUploadQueue: Queue,
    private fileRepository: FileRepository,
  ) {}

  onModuleInit() {
    this.logger.log('File scheduler service initialized');
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async scheduleAbandonedUploadCleanup() {
    this.logger.debug('Scheduling abandoned upload cleanup job');

    // Find files that have been pending upload for more than 24 hours
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - 24);

    const abandonedFiles = await this.fileRepository.getFilesOlderThan(cutoffDate, FileStatus.PENDING_UPLOAD);

    this.logger.debug(`Found ${abandonedFiles.length} abandoned uploads`);

    for (const file of abandonedFiles) {
      await this.fileUploadQueue.add(
        FileUploadJob.CLEANUP_ABANDONED_UPLOADS,
        { fileId: file.id },
        {
          removeOnComplete: 5,
          removeOnFail: 3,
        },
      );
    }
  }
}

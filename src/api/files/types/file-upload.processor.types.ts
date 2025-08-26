import { Job } from 'bullmq';
import { FileUploadJob } from 'src/shared/enums/bull-queues';

export type CleanupAbandonedUploadJobArgs = {
  bucket: string;
  fileId: string;
  object_key: string;
};

export type FileUploadProcessJobs = Job<CleanupAbandonedUploadJobArgs, void, FileUploadJob.CLEANUP_ABANDONED_UPLOADS>;

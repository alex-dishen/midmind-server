import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/db/db.service';
import { FileGetOutput, FileCreateInput, FileUpdateInput, FileStatus } from 'src/db/types/db.types';

@Injectable()
export class FileRepository {
  constructor(private kysely: DatabaseService) {}

  async createFile(data: FileCreateInput): Promise<FileGetOutput> {
    return this.kysely.db.insertInto('files').values(data).returningAll().executeTakeFirstOrThrow();
  }

  async updateFile(fileId: string, data: FileUpdateInput): Promise<void> {
    await this.kysely.db.updateTable('files').set(data).where('id', '=', fileId).execute();
  }

  async getFileById(fileId: string): Promise<FileGetOutput | undefined> {
    return this.kysely.db.selectFrom('files').selectAll().where('id', '=', fileId).executeTakeFirst();
  }

  async getFilesOlderThan(cutoffDate: Date, status: FileStatus): Promise<FileGetOutput[]> {
    return this.kysely.db
      .selectFrom('files')
      .selectAll()
      .where('created_at', '<', cutoffDate)
      .where('status', '=', status)
      .execute();
  }

  async deleteFile(fileId: string): Promise<void> {
    await this.kysely.db.deleteFrom('files').where('id', '=', fileId).execute();
  }
}

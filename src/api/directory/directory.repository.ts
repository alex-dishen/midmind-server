import { Injectable } from '@nestjs/common';
import { sql } from 'kysely';
import { DatabaseService } from 'src/db/db.service';
import { DirectoryCreateInput, DirectoryGetOutput, DirectoryUpdateInput } from 'src/db/types/db.types';

@Injectable()
export class DirectoryRepository {
  constructor(private kysely: DatabaseService) {}

  async createDirectory(data: DirectoryCreateInput): Promise<void> {
    await this.kysely.db.insertInto('directories').values(data).execute();
  }

  async updateDirectory(directoryId: string, data: DirectoryUpdateInput): Promise<void> {
    await this.kysely.db.updateTable('directories').set(data).where('id', '=', directoryId).execute();
  }

  async updateDirectoryByIds(directoryIds: string[], data: DirectoryUpdateInput): Promise<void> {
    await this.kysely.db.updateTable('directories').set(data).where('id', 'in', directoryIds).execute();
  }

  async getDirectoryById(directoryId: string): Promise<DirectoryGetOutput | undefined> {
    return this.kysely.db.selectFrom('directories').selectAll().where('id', '=', directoryId).executeTakeFirst();
  }

  async getDirectoriesByIds(directoryIds: string[]): Promise<DirectoryGetOutput[]> {
    return this.kysely.db.selectFrom('directories').selectAll().where('id', 'in', directoryIds).execute();
  }

  async getDirectoryIdsByPathId(directoryId: string): Promise<{ id: string }[]> {
    return this.kysely.db
      .selectFrom('directories')
      .select('id')
      .where(sql<boolean>`${directoryId} = ANY(path)`)
      .execute();
  }
}

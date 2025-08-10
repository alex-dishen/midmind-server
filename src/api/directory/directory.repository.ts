import { Injectable } from '@nestjs/common';
import { sql } from 'kysely';
import { DatabaseService } from 'src/db/db.service';
import { DirectoryCreateInput, DirectoryGetOutput, DirectoryUpdateInput } from 'src/db/types/db.types';
import { GetDirectoriesGetOutput } from './types/directory.repository.types';

@Injectable()
export class DirectoryRepository {
  constructor(private kysely: DatabaseService) {}

  async createDirectory(data: DirectoryCreateInput): Promise<void> {
    await this.kysely.db.insertInto('directories').values(data).execute();
  }

  async updateDirectory(directoryId: string, data: DirectoryUpdateInput): Promise<void> {
    await this.kysely.db.updateTable('directories').set(data).where('id', '=', directoryId).execute();
  }

  async updateDirectoriesByIds(directoryIds: string[], data: DirectoryUpdateInput): Promise<void> {
    await this.kysely.db.updateTable('directories').set(data).where('id', 'in', directoryIds).execute();
  }

  async getDirectoryById(directoryId: string): Promise<DirectoryGetOutput | undefined> {
    return this.kysely.db.selectFrom('directories').selectAll().where('id', '=', directoryId).executeTakeFirst();
  }

  async getDirectoriesByIds(directoryIds: string[]): Promise<DirectoryGetOutput[]> {
    return this.kysely.db.selectFrom('directories').selectAll().where('id', 'in', directoryIds).execute();
  }

  async getDirectoriesBy(where: Partial<DirectoryGetOutput>): Promise<GetDirectoriesGetOutput[]> {
    let qb = this.kysely.db.selectFrom('directories');

    for (const [key, value] of Object.entries(where)) {
      if (value !== undefined && value !== null) {
        qb = qb.where(key as keyof DirectoryGetOutput, '=', value as never);
      }
    }

    return qb
      .select([
        'id',
        'name',
        'type',
        sql<boolean>`
          EXISTS (SELECT 1 FROM directories d2 WHERE d2.parent_directory_id = directories.id)
          OR EXISTS (SELECT 1 FROM chats c WHERE c.directory_id = directories.id)
        `.as('has_children'),
      ])
      .orderBy('created_at', 'desc')
      .execute();
  }

  async getDirectoryIdsByPathId(directoryId: string): Promise<{ id: string }[]> {
    return this.kysely.db
      .selectFrom('directories')
      .select('id')
      .where(sql<boolean>`${directoryId} = ANY(path)`)
      .execute();
  }
}

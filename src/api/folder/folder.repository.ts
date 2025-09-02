import { Injectable } from '@nestjs/common';
import { sql } from 'kysely';
import { DatabaseService } from 'src/db/db.service';
import { FolderCreateInput, FolderGetOutput, FolderUpdateInput } from 'src/db/types/db.types';
import { GetFoldersGetOutput } from './types/folder.repository.types';

@Injectable()
export class FolderRepository {
  constructor(private kysely: DatabaseService) {}

  async createFolder(data: FolderCreateInput): Promise<void> {
    await this.kysely.db.insertInto('folders').values(data).execute();
  }

  async updateFolder(folderId: string, data: FolderUpdateInput): Promise<void> {
    await this.kysely.db.updateTable('folders').set(data).where('id', '=', folderId).execute();
  }

  async updateFoldersByIds(folderIds: string[], data: FolderUpdateInput): Promise<void> {
    await this.kysely.db.updateTable('folders').set(data).where('id', 'in', folderIds).execute();
  }

  getFolderById(folderId: string): Promise<FolderGetOutput | undefined> {
    return this.kysely.db.selectFrom('folders').selectAll().where('id', '=', folderId).executeTakeFirst();
  }

  getFoldersByIds(folderIds: string[]): Promise<FolderGetOutput[]> {
    return this.kysely.db.selectFrom('folders').selectAll().where('id', 'in', folderIds).execute();
  }

  getFoldersBy(where: Partial<FolderGetOutput>): Promise<GetFoldersGetOutput[]> {
    let qb = this.kysely.db.selectFrom('folders');

    for (const [key, value] of Object.entries(where)) {
      if (value === null) {
        qb = qb.where(key as keyof FolderGetOutput, 'is', null);
      } else if (value !== undefined) {
        qb = qb.where(key as keyof FolderGetOutput, '=', value as never);
      }
    }

    return qb
      .select([
        'id',
        'name',
        sql<boolean>`
          EXISTS (SELECT 1 FROM folders d2 WHERE d2.parent_folder_id = folders.id)
          OR EXISTS (SELECT 1 FROM chats c WHERE c.folder_id = folders.id)
        `.as('has_children'),
      ])
      .orderBy('created_at', 'desc')
      .execute();
  }

  getFolderIdsByPathId(folderId: string): Promise<{ id: string }[]> {
    return this.kysely.db
      .selectFrom('folders')
      .select('id')
      .where(sql<boolean>`${folderId} = ANY(path)`)
      .execute();
  }
}

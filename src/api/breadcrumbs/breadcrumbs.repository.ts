import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/db/db.service';
import {
  GetChatByIdForBreadcrumbsOutput,
  GetChatsByIdsForBreadcrumbsOutput,
  GetFoldersByIdsForBreadcrumbsOutput,
  GetFolderForBreadcrumbsOutput,
} from './types/breadcrumbs.repository.types';

@Injectable()
export class BreadcrumbsRepository {
  constructor(private kysely: DatabaseService) {}

  getFolderById(folderId: string): Promise<GetFolderForBreadcrumbsOutput | undefined> {
    return this.kysely.db.selectFrom('folders').select('path').where('id', '=', folderId).executeTakeFirst();
  }

  getFoldersByIds(folderIds: string[]): Promise<GetFoldersByIdsForBreadcrumbsOutput[]> {
    return this.kysely.db.selectFrom('folders').select(['id', 'name']).where('id', 'in', folderIds).execute();
  }

  getChatById(chatId: string): Promise<GetChatByIdForBreadcrumbsOutput | undefined> {
    return this.kysely.db.selectFrom('chats').select(['path', 'folder_id']).where('id', '=', chatId).executeTakeFirst();
  }

  getChatsByIds(chatIds: string[]): Promise<GetChatsByIdsForBreadcrumbsOutput[]> {
    return this.kysely.db
      .selectFrom('chats')
      .select(['id', 'name', 'parent_chat_id', 'folder_id'])
      .where('id', 'in', chatIds)
      .orderBy('depth', 'asc')
      .execute();
  }
}

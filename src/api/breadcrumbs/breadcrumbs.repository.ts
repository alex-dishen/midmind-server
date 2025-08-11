import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/db/db.service';
import {
  GetChatByIdForBreadcrumbsOutput,
  GetChatsByIdsForBreadcrumbsOutput,
  GetDirectoriesByIdsForBreadcrumbsOutput,
  GetDirectoryForBreadcrumbsOutput,
} from './types/breadcrumbs.repository.types';

@Injectable()
export class BreadcrumbsRepository {
  constructor(private kysely: DatabaseService) {}

  getDirectoryById(directoryId: string): Promise<GetDirectoryForBreadcrumbsOutput | undefined> {
    return this.kysely.db.selectFrom('directories').select('path').where('id', '=', directoryId).executeTakeFirst();
  }

  getDirectoriesByIds(directoryIds: string[]): Promise<GetDirectoriesByIdsForBreadcrumbsOutput[]> {
    return this.kysely.db.selectFrom('directories').select(['id', 'name', 'type']).where('id', 'in', directoryIds).execute();
  }

  getChatById(chatId: string): Promise<GetChatByIdForBreadcrumbsOutput | undefined> {
    return this.kysely.db.selectFrom('chats').select(['path', 'directory_id']).where('id', '=', chatId).executeTakeFirst();
  }

  getChatsByIds(chatIds: string[]): Promise<GetChatsByIdsForBreadcrumbsOutput[]> {
    return this.kysely.db
      .selectFrom('chats')
      .select(['id', 'name', 'parent_chat_id', 'directory_id'])
      .where('id', 'in', chatIds)
      .orderBy('depth', 'asc')
      .execute();
  }
}

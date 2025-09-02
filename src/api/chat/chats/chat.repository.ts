import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/db/db.service';
import { GetChatsByOutput, GetChatByIdOutput, GetChatWithChatMetadataOutput } from './types/chat.repository.types';
import { ChatCreateInput, ChatGetOutput, ChatUpdateInput } from 'src/db/types/db.types';
import { sql } from 'kysely';

@Injectable()
export class ChatRepository {
  constructor(private kysely: DatabaseService) {}

  async createChat(data: ChatCreateInput): Promise<void> {
    await this.kysely.db.insertInto('chats').values(data).executeTakeFirstOrThrow();
  }

  async updateChat(chatId: string, data: ChatUpdateInput): Promise<void> {
    await this.kysely.db.updateTable('chats').set(data).where('id', '=', chatId).execute();
  }

  async updateChatsByFolderIds(folderIds: string[], data: ChatUpdateInput): Promise<void> {
    await this.kysely.db.updateTable('chats').set(data).where('folder_id', 'in', folderIds).execute();
  }

  async updateChatsByPathChatId(chatId: string, data: ChatUpdateInput): Promise<void> {
    await this.kysely.db
      .updateTable('chats')
      .set(data)
      .where(sql<boolean>`${chatId} = ANY(path)`)
      .execute();
  }

  getChatsBy(where: Partial<ChatGetOutput>): Promise<GetChatsByOutput[]> {
    let qb = this.kysely.db.selectFrom('chats');

    for (const [key, value] of Object.entries(where)) {
      if (value === null) {
        qb = qb.where(key as keyof ChatGetOutput, 'is', null);
      } else if (value !== undefined) {
        qb = qb.where(key as keyof ChatGetOutput, '=', value);
      }
    }

    return qb
      .select([
        'id',
        'name',
        'folder_id',
        'parent_chat_id',
        sql<boolean>`EXISTS (SELECT 1 FROM chats c2 WHERE c2.parent_chat_id = chats.id)`.as('has_children'),
      ])
      .orderBy('created_at', 'desc')
      .execute();
  }

  getChatById(chatId: string): Promise<GetChatByIdOutput | undefined> {
    return this.kysely.db
      .selectFrom('chats')
      .where('id', '=', chatId)
      .select(['id', 'name', 'depth', 'root_chat_id', 'path'])
      .executeTakeFirst();
  }

  getChatWithChatMetadata(chatId: string): Promise<GetChatWithChatMetadataOutput | undefined> {
    return this.kysely.db
      .selectFrom('chats as c')
      .leftJoin('chat_metadata as bc', 'c.id', 'bc.child_chat_id')
      .select(['c.id', 'c.name', 'bc.parent_chat_id', 'bc.parent_message_id'])
      .where('c.id', '=', chatId)
      .executeTakeFirstOrThrow();
  }

  async deleteChat(chatId: string): Promise<void> {
    await this.kysely.db.deleteFrom('chats').where('id', '=', chatId).execute();
  }
}

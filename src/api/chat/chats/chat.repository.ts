import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/db/db.service';
import { ChatData, GetChatByIdOutput } from './types/chat.repository.types';
import { ChatCreateInput, ChatGetOutput, ChatUpdateInput } from 'src/db/types/db.types';

@Injectable()
export class ChatRepository {
  constructor(private kysely: DatabaseService) {}

  getChatsBy(where: Partial<ChatGetOutput>): Promise<ChatData[]> {
    let qb = this.kysely.db.selectFrom('chats');

    for (const [key, value] of Object.entries(where)) {
      qb = qb.where(key as keyof ChatGetOutput, '=', value);
    }

    return qb.select(['id', 'name', 'depth']).orderBy('created_at', 'desc').execute();
  }

  createChat(data: ChatCreateInput): Promise<ChatData> {
    return this.kysely.db.insertInto('chats').values(data).returning(['id', 'name', 'depth']).executeTakeFirstOrThrow();
  }

  getChatById(chatId: string): Promise<GetChatByIdOutput | undefined> {
    return this.kysely.db
      .selectFrom('chats')
      .where('id', '=', chatId)
      .select(['id', 'name', 'depth', 'root_chat_id', 'path'])
      .executeTakeFirst();
  }

  async updateChat(chatId: string, data: ChatUpdateInput): Promise<void> {
    await this.kysely.db.updateTable('chats').set(data).where('id', '=', chatId).execute();
  }

  async deleteChat(chatId: string): Promise<void> {
    await this.kysely.db.deleteFrom('chats').where('id', '=', chatId).execute();
  }
}

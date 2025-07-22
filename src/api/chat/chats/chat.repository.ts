import { DatabaseService } from 'src/db/db.service';
import { Injectable } from '@nestjs/common';
import { ChatCreateInput, ChatGetOutput, ChatUpdateInput } from 'src/db/types/db.types';
import { ChatData, IChatRepository } from './interfaces/chat.repository.interface';

@Injectable()
export class ChatRepository implements IChatRepository {
  constructor(private kysely: DatabaseService) {}

  getChatsBy(where: Partial<ChatGetOutput>): Promise<ChatData[]> {
    let qb = this.kysely.db.selectFrom('chats');

    for (const [key, value] of Object.entries(where)) {
      qb = qb.where(key as keyof ChatGetOutput, '=', value);
    }

    return qb.select(['id', 'created_at', 'name', 'updated_at', 'description']).execute();
  }

  createChat(data: ChatCreateInput): Promise<ChatData> {
    return this.kysely.db
      .insertInto('chats')
      .values(data)
      .returning(['id', 'created_at', 'name', 'updated_at', 'description'])
      .executeTakeFirstOrThrow();
  }

  getChatById(chatId: string): Promise<ChatData> {
    return this.kysely.db
      .selectFrom('chats')
      .where('id', '=', chatId)
      .select(['id', 'created_at', 'name', 'updated_at', 'description'])
      .executeTakeFirstOrThrow();
  }

  async updateChat(chatId: string, data: ChatUpdateInput): Promise<void> {
    await this.kysely.db.updateTable('chats').set(data).where('id', '=', chatId).execute();
  }

  async deleteChat(chatId: string): Promise<void> {
    await this.kysely.db.deleteFrom('chats').where('id', '=', chatId).execute();
  }
}

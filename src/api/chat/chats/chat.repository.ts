import { DatabaseService } from 'src/db/db.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatCreateInput, ChatGetOutput, ChatUpdateInput } from 'src/db/types/db.types';

@Injectable()
export class ChatRepository {
  constructor(private kysely: DatabaseService) {}

  getChatsByUserId(userId: string): Promise<ChatGetOutput[]> {
    return this.kysely.db.selectFrom('chats').where('user_id', '=', userId).selectAll().execute();
  }

  createChat(data: ChatCreateInput): Promise<ChatGetOutput> {
    return this.kysely.db
      .insertInto('chats')
      .values(data)
      .returningAll()
      .executeTakeFirstOrThrow(() => new NotFoundException());
  }

  getChatById(chatId: string): Promise<ChatGetOutput> {
    return this.kysely.db
      .selectFrom('chats')
      .where('id', '=', chatId)
      .selectAll()
      .executeTakeFirstOrThrow(() => new NotFoundException());
  }

  async updateChat(chatId: string, data: ChatUpdateInput): Promise<void> {
    await this.kysely.db.updateTable('chats').set(data).where('id', '=', chatId).execute();
  }

  async deleteChat(chatId: string): Promise<void> {
    await this.kysely.db.deleteFrom('chats').where('id', '=', chatId).execute();
  }
}

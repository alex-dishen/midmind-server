import { DatabaseService } from 'src/db/db.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginatedResult, PaginateOptions } from 'src/shared/dtos/pagination.dto';
import { ChatCreateInput, ChatGetOutput, ChatUpdateInput } from 'src/db/types/db.types';

@Injectable()
export class ChatRepository {
  constructor(private kysely: DatabaseService) {}

  createChat(data: ChatCreateInput): Promise<ChatGetOutput> {
    return this.kysely.db
      .insertInto('chats')
      .values(data)
      .returningAll()
      .executeTakeFirstOrThrow(() => new NotFoundException());
  }

  getUserChats(userId: string, pagination: PaginateOptions): Promise<PaginatedResult<ChatGetOutput>> {
    const qb = this.kysely.db
      .selectFrom('chats as c')
      .innerJoin('chat_participants as cp', 'c.id', 'cp.chat_id')
      .selectAll('c')
      .where('cp.user_id', '=', userId);

    return this.kysely.paginate(qb, pagination);
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

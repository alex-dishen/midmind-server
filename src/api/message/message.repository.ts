import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/db/db.service';
import { MessageCreateInput, MessageUpdateInput } from 'src/db/types/db.types';
import { PaginatedResult, PaginateOptions } from 'src/shared/dtos/pagination.dto';
import { GetChatMessagesOutput } from './types/message.repository.types';

@Injectable()
export class MessageRepository {
  constructor(private kysely: DatabaseService) {}

  async createMessage(data: MessageCreateInput): Promise<void> {
    await this.kysely.db.insertInto('messages').values(data).execute();
  }

  getChatMessages(chatId: string, pagination: PaginateOptions): Promise<PaginatedResult<GetChatMessagesOutput>> {
    const qb = this.kysely.db
      .selectFrom('messages')
      .select(['id', 'content', 'user_id', 'edited_at', 'created_at', 'updated_at', 'type', 'reply_to_id', 'is_edited'])
      .where('chat_id', '=', chatId);

    return this.kysely.paginate(qb, pagination);
  }

  async updateMessage(messageId: string, data: MessageUpdateInput): Promise<void> {
    await this.kysely.db.updateTable('messages').set(data).where('id', '=', messageId).execute();
  }
}

import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/db/db.service';
import { MessageCreateInput } from 'src/db/types/db.types';
import { PaginatedResult, PaginateOptions } from 'src/shared/dtos/pagination.dto';
import { IMessageRepository, MessageData } from './interfaces/message.repository.interface';

@Injectable()
export class MessageRepository implements IMessageRepository {
  constructor(private kysely: DatabaseService) {}

  async createMessage(data: MessageCreateInput | MessageCreateInput[]): Promise<void> {
    await this.kysely.db.insertInto('messages').values(data).execute();
  }

  getChatMessages(chatId: string, pagination: PaginateOptions): Promise<PaginatedResult<MessageData>> {
    const qb = this.kysely.db
      .selectFrom('messages')
      .select(['id', 'content', 'role', 'created_at'])
      .where('chat_id', '=', chatId)
      .orderBy('created_at', 'asc');

    return this.kysely.paginate(qb, pagination);
  }
}

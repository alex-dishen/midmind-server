import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/db/db.service';
import { MessageCreateInput } from 'src/db/types/db.types';
import { MessageData } from './types/message.repository.types';
import { PaginatedResult, PaginateOptions } from 'src/shared/dtos/pagination.dto';
import { jsonArrayFrom } from 'kysely/helpers/postgres';

@Injectable()
export class MessageRepository {
  constructor(private kysely: DatabaseService) {}

  async createMessage(data: MessageCreateInput | MessageCreateInput[]): Promise<void> {
    await this.kysely.db.insertInto('messages').values(data).execute();
  }

  getChatMessages(chatId: string, pagination: PaginateOptions): Promise<PaginatedResult<MessageData>> {
    const qb = this.kysely.db
      .selectFrom('messages as m')
      .leftJoin('message_replies as mr', 'mr.message_id', 'm.id')
      .select(eb => [
        'm.id',
        'm.role',
        'm.content',
        'm.llm_model',
        'm.created_at',

        'mr.reply_content',

        jsonArrayFrom(
          eb
            .selectFrom('branch_contexts as tc')
            .select([
              'tc.id',
              'tc.context_type',
              'tc.end_position',
              'tc.child_chat_id',
              'tc.start_position',
              'tc.connection_type',
              'tc.connection_color',
            ])
            .whereRef('m.id', '=', 'tc.parent_message_id')
            .orderBy('created_at'),
        ).as('branches'),
      ])
      .where('chat_id', '=', chatId)
      .orderBy('created_at', 'desc');

    return this.kysely.paginate(qb, pagination);
  }
}

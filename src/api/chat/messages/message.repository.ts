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
      .select(eb => [
        'id',
        'content',
        'role',
        'llm_model',
        'created_at',
        jsonArrayFrom(
          eb
            .selectFrom('branch_contexts as tc')
            .select([
              'tc.id',
              'tc.child_chat_id',
              'tc.connection_type',
              'tc.connection_color',
              'tc.context_type',
              'tc.end_position',
              'tc.start_position',
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

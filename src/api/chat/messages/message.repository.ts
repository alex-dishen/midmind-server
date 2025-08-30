import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/db/db.service';
import { FileBindingType, MessageCreateInput } from 'src/db/types/db.types';
import { MessageData } from './types/message.repository.types';
import { PaginatedResult, PaginateOptions } from 'src/shared/dtos/pagination.dto';
import { jsonArrayFrom } from 'kysely/helpers/postgres';

@Injectable()
export class MessageRepository {
  constructor(private kysely: DatabaseService) {}

  async createMessage(data: MessageCreateInput | MessageCreateInput[]): Promise<void> {
    await this.kysely.db.insertInto('messages').values(data).execute();
  }

  async checkIfChatHasMessages(chatId: string): Promise<boolean> {
    const row = await this.kysely.db
      .selectFrom('messages')
      .select('id')
      .where('chat_id', '=', chatId)
      .limit(1)
      .executeTakeFirst();

    return !!row;
  }

  getChatMessagesPaginated(chatId: string, pagination: PaginateOptions): Promise<PaginatedResult<MessageData>> {
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
            .selectFrom('file_bindings as fb')
            .innerJoin('files as f', 'f.id', 'fb.file_id')
            .select(['f.id', 'f.original_filename', 'f.mime_type'])
            .whereRef('fb.target_id', '=', 'm.id')
            .where('fb.target_type', '=', FileBindingType.MESSAGE)
            .orderBy('fb.created_at'),
        ).as('attachments'),

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

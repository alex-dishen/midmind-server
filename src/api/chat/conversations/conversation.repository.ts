import { Injectable } from '@nestjs/common';
import { sql } from 'kysely';
import { DatabaseService } from 'src/db/db.service';

@Injectable()
export class ConversationRepository {
  constructor(private kysely: DatabaseService) {}

  async getMessagesForAiContext(currentChatId: string) {
    const result = await this.kysely.db
      .withRecursive('chat_path', qb =>
        qb
          // Base case: current chat
          .selectFrom('chats')
          .leftJoin('branch_contexts', 'branch_contexts.child_chat_id', 'chats.id')
          .leftJoin('messages as parent_msg', 'parent_msg.id', 'branch_contexts.parent_message_id')
          .select([
            'chats.id as chat_id',
            'chats.parent_chat_id',
            sql<number>`0`.as('depth'),
            sql<Date | null>`NULL::timestamp`.as('cutoff_time'),
          ])
          .where('chats.id', '=', currentChatId)
          .unionAll(
            // Recursive case: parent chats
            qb
              .selectFrom('chats')
              .innerJoin('chat_path', 'chats.id', 'chat_path.parent_chat_id')
              .leftJoin('branch_contexts', 'branch_contexts.child_chat_id', 'chat_path.chat_id')
              .leftJoin('messages as cutoff_msg', 'cutoff_msg.id', 'branch_contexts.parent_message_id')
              .select([
                'chats.id as chat_id',
                'chats.parent_chat_id',
                sql<number>`chat_path.depth + 1`.as('depth'),
                'cutoff_msg.created_at as cutoff_time',
              ]),
          ),
      )
      .selectFrom('chat_path')
      .innerJoin('messages', 'messages.chat_id', 'chat_path.chat_id')
      .select(['messages.content', 'messages.role'])
      .where(eb =>
        eb.or([
          eb('chat_path.depth', '=', 0),
          eb.and([
            eb('chat_path.depth', '>', 0),
            eb('chat_path.cutoff_time', 'is not', null),
            eb('messages.created_at', '<=', eb.ref('chat_path.cutoff_time')),
          ]),
        ]),
      )
      .orderBy('chat_path.depth', 'desc')
      .orderBy('messages.created_at', 'asc')
      .execute();

    return result;
  }
}

import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/db/db.service';
import { CreateThreadContextOutput, GetThreadContextByOutput } from './types/thread-context.repository.types';
import { ThreadContextCreateInput, ThreadContextGetOutput } from 'src/db/types/db.types';

@Injectable()
export class ThreadContextRepository {
  constructor(private kysely: DatabaseService) {}

  createThreadContext(data: ThreadContextCreateInput): Promise<CreateThreadContextOutput> {
    return this.kysely.db
      .insertInto('thread_contexts')
      .values(data)
      .returning(['id', 'connection_color', 'context_type', 'end_position', 'start_position', 'connection_type'])
      .executeTakeFirstOrThrow();
  }

  getThreadContextBy(where: Partial<ThreadContextGetOutput>): Promise<GetThreadContextByOutput[]> {
    let qb = this.kysely.db.selectFrom('thread_contexts');

    for (const [key, value] of Object.entries(where)) {
      qb = qb.where(key as keyof ThreadContextGetOutput, '=', value);
    }

    return qb
      .select(['id', 'child_chat_id', 'connection_type', 'connection_color', 'context_type', 'end_position', 'start_position'])
      .execute();
  }
}

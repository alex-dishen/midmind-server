import { ChatGetOutput } from 'src/db/types/db.types';

export type ChatData = Pick<ChatGetOutput, 'id' | 'created_at' | 'name' | 'updated_at' | 'thread_level'>;

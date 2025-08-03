import { MessageGetOutput, ThreadContextGetOutput } from 'src/db/types/db.types';

export type MessageData = Pick<MessageGetOutput, 'id' | 'content' | 'role' | 'llm_model' | 'created_at'> & {
  threads: Pick<
    ThreadContextGetOutput,
    'id' | 'connection_type' | 'connection_color' | 'context_type' | 'end_position' | 'start_position' | 'child_chat_id'
  >[];
};

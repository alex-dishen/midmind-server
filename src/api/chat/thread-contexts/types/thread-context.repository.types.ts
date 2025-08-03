import { ThreadContextGetOutput } from 'src/db/types/db.types';

export type CreateThreadContextOutput = Pick<
  ThreadContextGetOutput,
  'id' | 'connection_color' | 'context_type' | 'end_position' | 'start_position' | 'connection_type'
>;

export type GetThreadContextByOutput = Pick<
  ThreadContextGetOutput,
  'id' | 'connection_color' | 'context_type' | 'end_position' | 'start_position' | 'connection_type' | 'child_chat_id'
>;

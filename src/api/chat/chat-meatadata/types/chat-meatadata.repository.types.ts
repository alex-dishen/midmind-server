import { ChatMetadataGetOutput } from 'src/db/types/db.types';

export type GetChatMetadataByOutput = Pick<
  ChatMetadataGetOutput,
  'id' | 'connection_color' | 'context_type' | 'end_position' | 'start_position' | 'connection_type' | 'child_chat_id'
>;

import { MessageGetOutput, BranchContextGetOutput, FileGetOutput } from 'src/db/types/db.types';

export type MessageData = Pick<MessageGetOutput, 'id' | 'content' | 'role' | 'llm_model' | 'created_at'> & {
  reply_content: string | null;
  branches: Pick<
    BranchContextGetOutput,
    'id' | 'connection_type' | 'connection_color' | 'context_type' | 'end_position' | 'start_position' | 'child_chat_id'
  >[];
  attachments: Pick<FileGetOutput, 'id' | 'original_filename' | 'mime_type'>[];
};

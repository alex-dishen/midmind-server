import { MessageType } from 'src/db/types/db.types';

export type GetChatMessagesOutput = {
  id: string;
  content: string;
  user_id: string;
  edited_at: Date;
  created_at: Date;
  updated_at: Date;
  type: MessageType;
  is_edited: boolean;
  reply_to_id: string | null;
};

import { ConnectionType, ContextType, MessageSenderRole } from 'src/db/types/db.types';

export type GetChatMessagesOutput = {
  id: string;
  content: string;
  created_at: Date;
  role: MessageSenderRole;
  llm_model: string | null;
  branches: {
    id: string;
    child_chat_id: string;
    connection_color: string;
    context_type: ContextType;
    end_position: number | null;
    start_position: number | null;
    connection_type: ConnectionType;
  }[];
};

import { ConnectionType, ContextType, MessageSenderRole } from 'src/db/types/db.types';

export type GetChatMessagesOutput = {
  id: string;
  content: string;
  role: MessageSenderRole;
  llm_model: string | null;
  threads: {
    id: string;
    start_position: number | null;
    end_position: number | null;
    context_type: ContextType;
    connection_type: ConnectionType;
    connection_color: string;
  }[];
};

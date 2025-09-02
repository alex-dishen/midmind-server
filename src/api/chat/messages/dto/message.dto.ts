import { IsUUID } from 'class-validator';
import { ContextType, MessageSenderRole } from 'src/db/types/db.types';

class AppMessageNestedChatDto {
  @IsUUID()
  id: string;

  @IsUUID()
  child_chat_id: string;

  connection_type: string;
  connection_color: string;
  context_type: ContextType;
  end_position: number | null;
  start_position: number | null;
}

class AppMessageAttachmentDto {
  id: string;
  mime_type: string;
  original_filename: string;
}

// The name is not MessageDto as there is already general MessageDto class
export class AppMessageDto {
  @IsUUID()
  id: string;

  content: string;
  created_at: Date;
  role: MessageSenderRole;
  llm_model: string | null;
  reply_content: string | null;
  nested_chats: AppMessageNestedChatDto[];
  attachments: AppMessageAttachmentDto[];
}

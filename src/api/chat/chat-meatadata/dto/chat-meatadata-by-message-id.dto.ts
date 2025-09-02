import { IsUUID } from 'class-validator';
import { ContextType } from 'src/db/types/db.types';

export class ChatMetadataByMessageIdDto {
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

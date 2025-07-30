import { IsUUID } from 'class-validator';
import { ContextType, MessageSenderRole } from 'src/db/types/db.types';

class AppMessageThreadDto {
  id: string;
  connection_type: string;
  connection_color: string;
  context_type: ContextType;
  end_position: number | null;
  start_position: number | null;
}

// The name is not MessageDto as there is already general MessageDto class
export class AppMessageDto {
  @IsUUID()
  id: string;

  content: string;
  role: MessageSenderRole;
  llm_model: string | null;
  threads: AppMessageThreadDto[];
}

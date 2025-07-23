import { MessageType } from 'src/db/types/db.types';
import { IsUUID } from 'class-validator';

// The name is not MessageDto as there is already general MessageDto class
export class AppMessageDto {
  @IsUUID()
  id: string;

  content: string;
  created_at: Date;
  type: MessageType;
  user_id: string | null;
}

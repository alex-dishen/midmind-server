import { MessageType } from 'src/db/types/db.types';
import { IsUUID } from 'class-validator';

// The name is not MessageDto as there is already general MessageDto class
export class AppMessageDto {
  @IsUUID()
  id: string;

  content: string;
  user_id: string;
  edited_at: Date;
  created_at: Date;
  updated_at: Date;
  type: MessageType;
  is_edited: boolean;
}

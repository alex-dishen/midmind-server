import { IsUUID } from 'class-validator';
import { MessageSenderRole } from 'src/db/types/db.types';

// The name is not MessageDto as there is already general MessageDto class
export class AppMessageDto {
  @IsUUID()
  id: string;

  content: string;
  created_at: Date;
  role: MessageSenderRole;
}

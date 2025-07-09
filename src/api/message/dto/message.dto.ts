import { MessageType } from 'src/db/types/db.types';
import { IsString, IsOptional, IsUUID, IsEnum } from 'class-validator';

// The name is not MessageDto as there is already general MessageDto
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
  reply_to_id: string | null;
}

export class CreateMessageDto {
  @IsString()
  content: string;

  @IsEnum(MessageType)
  type: MessageType;

  @IsUUID()
  user_id: string;

  @IsUUID()
  @IsOptional()
  reply_to_id?: string;
}

export class UpdateMessageDto {
  @IsString()
  content: string;
}

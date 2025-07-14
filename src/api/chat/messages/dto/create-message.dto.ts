import { MessageType } from 'src/db/types/db.types';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

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

import { IsEnum, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { ConnectionType, ContextType } from 'src/db/types/db.types';

class CreateChatBranchContext {
  @IsUUID()
  parent_chat_id: string;

  @IsUUID()
  parent_message_id: string;

  @IsString()
  @IsOptional()
  selected_text?: string;

  @IsNumber()
  @IsOptional()
  start_position?: number;

  @IsNumber()
  @IsOptional()
  end_position?: number;

  @IsEnum(ConnectionType)
  connection_type: ConnectionType;

  @IsEnum(ContextType)
  context_type: ContextType;
}

export class CreateChatDto {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsUUID()
  @IsOptional()
  directory_id?: string;

  @IsOptional()
  branch_context?: CreateChatBranchContext;
}

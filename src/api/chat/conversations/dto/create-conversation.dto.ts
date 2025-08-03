import { IsEnum, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { ConnectionType, ContextType } from 'src/db/types/db.types';
import { GeminiModels } from 'src/llm/gemini/type/gemini-models';

export enum ConversationResponseType {
  ERROR = 'error',
  TITLE = 'title',
  CONTENT = 'content',
  COMPLETE = 'complete',
}

class ConversationThreadContextDto {
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

export class CreateConversationDto {
  @IsUUID()
  chat_id: string;

  @IsUUID()
  message_id: string;

  @IsString()
  content: string;

  @IsEnum(GeminiModels)
  model: GeminiModels;

  @IsOptional()
  thread_context?: ConversationThreadContextDto;
}

export class CreateConversationResponseCompleteDto {
  id: string;
  type: ConversationResponseType;
}

export class CreateConversationResponseTitleDto {
  title: string;
  chat_id: string;
  type: ConversationResponseType;
}

export class CreateConversationResponseErrorDto {
  id: string;
  error: string;
  type: ConversationResponseType;
}

export class CreateConversationResponseContentDto {
  id: string;
  body: string;
  type: ConversationResponseType;
}

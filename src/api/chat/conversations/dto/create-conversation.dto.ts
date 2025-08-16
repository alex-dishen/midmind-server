import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { GeminiModels } from 'src/llm/gemini/type/gemini-models';

export enum ConversationResponseType {
  ERROR = 'error',
  TITLE = 'title',
  CONTENT = 'content',
  COMPLETE = 'complete',
}

class ConversationBranchContextDto {
  @IsUUID()
  parent_message_id: string;
}

export class ReplyToDto {
  @IsUUID()
  id: string;

  @IsString()
  content: string;
}

export class CreateConversationDto {
  @IsUUID()
  chat_id: string;

  @IsUUID()
  message_id: string;

  @IsEnum(GeminiModels)
  model: GeminiModels;

  @IsString()
  content: string;

  @IsOptional()
  reply_to?: ReplyToDto;

  @IsOptional()
  branch_context?: ConversationBranchContextDto;
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

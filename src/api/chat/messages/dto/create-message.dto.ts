import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { GeminiModels } from 'src/llm/gemini/type/gemini-models';

export enum MessageResponseType {
  ERROR = 'error',
  CONTENT = 'content',
  COMPLETE = 'complete',
}

export class CreateMessageDto {
  @IsString()
  content: string;

  @IsEnum(GeminiModels)
  model: GeminiModels;

  @IsUUID()
  @IsOptional()
  parent_message_id?: string;

  @IsUUID()
  response_message_id: string;
}

export class CreateMessageResponseCompleteDto {
  id: string;
  type: MessageResponseType;
}

export class CreateMessageResponseErrorDto {
  id: string;
  error: string;
  type: MessageResponseType;
}

export class CreateMessageResponseContentDto {
  body: string;
  type: MessageResponseType;
}

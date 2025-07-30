import { GeminiModels } from 'src/llm/gemini/type/gemini-models';
import {
  CreateConversationDto,
  CreateConversationResponseCompleteDto,
  CreateConversationResponseContentDto,
  CreateConversationResponseErrorDto,
} from '../dto/create-conversation.dto';

type OnChunkT = (
  chunk: CreateConversationResponseCompleteDto | CreateConversationResponseErrorDto | CreateConversationResponseContentDto,
) => void;

export type SaveConversationDataInput = {
  userId: string;
  llmMessageId: string;
  fullLlmResponse: string;
  data: CreateConversationDto;
};

export type StreamLLMResponseInput = {
  content: string;
  model: GeminiModels;
  llmMessageId: string;
  onChunk: OnChunkT;
};

export type AskAiInput = {
  userId: string;
  data: CreateConversationDto;
  onChunk: OnChunkT;
};

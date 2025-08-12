import { GeminiModels } from 'src/llm/gemini/type/gemini-models';
import {
  CreateConversationDto,
  CreateConversationResponseCompleteDto,
  CreateConversationResponseContentDto,
  CreateConversationResponseErrorDto,
  CreateConversationResponseTitleDto,
} from '../dto/create-conversation.dto';
import { ContentListUnion } from '@google/genai';
import { MessageSenderRole } from 'src/db/types/db.types';

type OnChunkT = (
  chunk:
    | CreateConversationResponseCompleteDto
    | CreateConversationResponseErrorDto
    | CreateConversationResponseContentDto
    | CreateConversationResponseTitleDto,
) => void;

export type GenerateAIPromptInput = {
  userInput: string;
  replyTo?: string;
  chatId?: string;
};

export type GenerateChatTitleOutput = {
  userInput: string;
  model: GeminiModels;
};

export type GetAIContextOutput = {
  role: MessageSenderRole;
  parts: { text: string }[];
};

export type SaveConversationDataInput = {
  userId: string;
  chatTitle: string;
  llmMessageId: string;
  fullLlmResponse: string;
  data: CreateConversationDto;
};

export type StreamLLMResponseInput = {
  contents: ContentListUnion;
  model: GeminiModels;
  llmMessageId: string;
  onChunk: OnChunkT;
};

export type AskAiInput = {
  userId: string;
  data: CreateConversationDto;
  onChunk: OnChunkT;
};

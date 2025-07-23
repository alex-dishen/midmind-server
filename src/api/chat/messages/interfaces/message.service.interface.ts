import { AppMessageDto } from '../dto/message.dto';
import { PaginatedResult, PaginateOptions } from 'src/shared/dtos/pagination.dto';
import {
  CreateMessageDto,
  CreateMessageResponseCompleteDto,
  CreateMessageResponseContentDto,
  CreateMessageResponseErrorDto,
} from '../dto/create-message.dto';

export type OnChunkT = (
  chunk: CreateMessageResponseCompleteDto | CreateMessageResponseErrorDto | CreateMessageResponseContentDto,
) => void;

export type CreateMessageInput = {
  chatId: string;
  userId: string;
  data: CreateMessageDto;
  onChunk: OnChunkT;
};

export interface IMessageService {
  createMessage(args: CreateMessageInput): Promise<void>;
  getChatMessages(chatId: string, pagination: PaginateOptions): Promise<PaginatedResult<AppMessageDto>>;
}

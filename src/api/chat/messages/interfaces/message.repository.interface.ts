import { MessageCreateInput, MessageGetOutput } from 'src/db/types/db.types';
import { PaginatedResult, PaginateOptions } from 'src/shared/dtos/pagination.dto';

export type MessageData = Pick<MessageGetOutput, 'id' | 'content' | 'created_at' | 'role'>;

export interface IMessageRepository {
  createMessage(data: MessageCreateInput | MessageCreateInput[]): Promise<void>;
  getChatMessages(chatId: string, pagination: PaginateOptions): Promise<PaginatedResult<MessageData>>;
}

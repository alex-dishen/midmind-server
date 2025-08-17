import { Injectable } from '@nestjs/common';
import { MessageRepository } from './message.repository';
import { GetChatMessagesOutput } from './types/message.service.types';
import { PaginatedResult, PaginateOptions } from 'src/shared/dtos/pagination.dto';

@Injectable()
export class MessageService {
  constructor(private messageRepository: MessageRepository) {}

  getChatMessages(chatId: string, pagination: PaginateOptions): Promise<PaginatedResult<GetChatMessagesOutput>> {
    return this.messageRepository.getChatMessagesPaginated(chatId, pagination);
  }
}

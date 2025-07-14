import { Injectable } from '@nestjs/common';
import { MessageRepository } from './message.repository';
import { AppMessageDto } from './dto/message.dto';
import { MessageDto } from 'src/shared/dtos/message.dto';
import { PaginatedResult, PaginateOptions } from 'src/shared/dtos/pagination.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageService {
  constructor(private messageRepository: MessageRepository) {}

  async createMessage(chatId: string, data: CreateMessageDto): Promise<MessageDto> {
    await this.messageRepository.createMessage({ ...data, chat_id: chatId });

    return { message: 'Successfully created a message' };
  }

  getChatMessages(chatId: string, pagination: PaginateOptions): Promise<PaginatedResult<AppMessageDto>> {
    return this.messageRepository.getChatMessages(chatId, pagination);
  }
}

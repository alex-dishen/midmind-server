import { Injectable } from '@nestjs/common';
import { MessageRepository } from './message.repository';
import { AppMessageDto, CreateMessageDto, UpdateMessageDto } from './dto/message.dto';
import { MessageDto } from 'src/shared/dtos/message.dto';
import { PaginatedResult, PaginateOptions } from 'src/shared/dtos/pagination.dto';

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

  async editMessageContent(messageId: string, data: UpdateMessageDto): Promise<MessageDto> {
    const currentDate = new Date().toISOString();

    await this.messageRepository.updateMessage(messageId, {
      ...data,
      is_edited: true,
      edited_at: currentDate,
      updated_at: currentDate,
    });

    return { message: 'Successfully edited the message' };
  }

  async softDeleteMessage(messageId: string): Promise<MessageDto> {
    const currentDate = new Date().toISOString();

    await this.messageRepository.updateMessage(messageId, { is_deleted: true, deleted_at: currentDate, updated_at: currentDate });

    return { message: 'Successfully soft-deleted the message' };
  }
}

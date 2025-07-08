import { Injectable } from '@nestjs/common';
import { MessageDto } from 'src/shared/dtos/message.dto';
import { ChatRepository } from 'src/api/chat/chat.repository';
import { ChatDto, CreateChatDto, UpdateChatDto } from 'src/api/chat/dto/chat.dto';
import { PaginatedResult, PaginateOptions } from 'src/shared/dtos/pagination.dto';

@Injectable()
export class ChatService {
  constructor(private chatRepository: ChatRepository) {}

  async createChat(data: CreateChatDto): Promise<ChatDto> {
    return this.chatRepository.createChat(data);
  }

  async getUserChats(userId: string, pagination: PaginateOptions): Promise<PaginatedResult<ChatDto>> {
    return this.chatRepository.getUserChats(userId, pagination);
  }

  async getChatById(chatId: string): Promise<ChatDto> {
    return this.chatRepository.getChatById(chatId);
  }

  async updateChat(chatId: string, data: UpdateChatDto): Promise<MessageDto> {
    await this.chatRepository.updateChat(chatId, { ...data, updated_at: new Date().toISOString() });

    return { message: 'Successfully updated the chat' };
  }

  async archiveChat(chatId: string): Promise<MessageDto> {
    await this.chatRepository.updateChat(chatId, { is_archived: true, updated_at: new Date().toString() });

    return { message: 'Successfully archived the chat' };
  }

  async deleteChat(chatId: string): Promise<MessageDto> {
    await this.chatRepository.deleteChat(chatId);

    return { message: 'Successfully delete the chat' };
  }
}

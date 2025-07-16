import { Injectable } from '@nestjs/common';
import { MessageDto } from 'src/shared/dtos/message.dto';
import { ChatDto } from 'src/api/chat/chats/dto/chat.dto';
import { ChatRepository } from './chat.repository';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatService {
  constructor(private chatRepository: ChatRepository) {}

  async getUserChats(userId: string): Promise<ChatDto[]> {
    return this.chatRepository.getChatsByUserId(userId);
  }

  async getChatById(chatId: string): Promise<ChatDto> {
    return this.chatRepository.getChatById(chatId);
  }

  async updateChat(chatId: string, data: UpdateChatDto): Promise<MessageDto> {
    await this.chatRepository.updateChat(chatId, { ...data, updated_at: new Date().toISOString() });

    return { message: 'Successfully updated the chat' };
  }

  async deleteChat(chatId: string): Promise<MessageDto> {
    await this.chatRepository.updateChat(chatId, { is_deleted: true, deleted_at: new Date().toString() });

    return { message: 'Successfully archived the chat' };
  }
}

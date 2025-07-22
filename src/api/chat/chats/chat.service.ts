import { Injectable } from '@nestjs/common';
import { ChatDto } from 'src/api/chat/chats/dto/chat.dto';
import { ChatRepository } from './chat.repository';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ChatServiceType, IChatService } from './interfaces/chat.service.interface';

@Injectable()
export class ChatService implements IChatService {
  constructor(private chatRepository: ChatRepository) {}

  async createChat(userId: string): Promise<ChatServiceType> {
    return this.chatRepository.createChat({ user_id: userId });
  }

  async getUserChats(userId: string): Promise<ChatDto[]> {
    return this.chatRepository.getChatsByUserId(userId);
  }

  async getChatById(chatId: string): Promise<ChatDto> {
    return this.chatRepository.getChatById(chatId);
  }

  async updateChat(chatId: string, data: UpdateChatDto): Promise<void> {
    await this.chatRepository.updateChat(chatId, { ...data, updated_at: new Date().toISOString() });
  }

  async deleteChat(chatId: string): Promise<void> {
    await this.chatRepository.updateChat(chatId, { is_deleted: true, deleted_at: new Date().toString() });
  }
}

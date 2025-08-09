import { Injectable } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { UpdateChatDto } from './dto/update-chat.dto';
import { GetChatByIdOutput, GetUserNonArchivedChatsOutput } from './types/chat.service.types';

@Injectable()
export class ChatService {
  constructor(private chatRepository: ChatRepository) {}
  getUserNonArchivedChats(userId: string): Promise<GetUserNonArchivedChatsOutput[]> {
    return this.chatRepository.getChatsBy({ user_id: userId, is_deleted: false });
  }

  getChatById(chatId: string): Promise<GetChatByIdOutput | undefined> {
    return this.chatRepository.getChatById(chatId);
  }

  async updateChat(chatId: string, data: UpdateChatDto): Promise<void> {
    await this.chatRepository.updateChat(chatId, { ...data, updated_at: new Date().toISOString() });
  }
  async deleteChat(chatId: string): Promise<void> {
    await this.chatRepository.updateChatsByPathChatId(chatId, { is_deleted: true, deleted_at: new Date().toISOString() });
  }
}

import { Injectable } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { UpdateChatDto } from './dto/update-chat.dto';
import { GetChatByIdOutput, GetUserNonArchivedChatsOutput } from './types/chat.service.types';
import { GetChatQueryDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(private chatRepository: ChatRepository) {}
  getUserNonArchivedChats(userId: string, queryParams: GetChatQueryDto): Promise<GetUserNonArchivedChatsOutput[]> {
    // parent_chat_id and parent_directory_id are self excluding. There can be one or none of them
    return this.chatRepository.getChatsBy({
      user_id: userId,
      is_deleted: false,
      parent_chat_id: queryParams.parent_chat_id || null,
      directory_id: queryParams.parent_directory_id || null,
    });
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

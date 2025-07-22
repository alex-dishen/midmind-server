import { ChatDto } from 'src/api/chat/chats/dto/chat.dto';
import { UpdateChatDto } from '../dto/update-chat.dto';

export type ChatServiceType = {
  id: string;
  created_at: Date;
  name: string | null;
  is_deleted: boolean;
  updated_at: Date | null;
  deleted_at: Date | null;
  description: string | null;
};

export interface IChatService {
  createChat(userId: string): Promise<ChatServiceType>;
  getUserChats(userId: string): Promise<ChatDto[]>;
  getChatById(chatId: string): Promise<ChatDto>;
  updateChat(chatId: string, data: UpdateChatDto): Promise<void>;
  deleteChat(chatId: string): Promise<void>;
}

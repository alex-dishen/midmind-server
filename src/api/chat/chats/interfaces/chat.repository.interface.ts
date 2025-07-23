import { ChatCreateInput, ChatGetOutput, ChatUpdateInput } from 'src/db/types/db.types';

export type ChatData = Pick<ChatGetOutput, 'id' | 'created_at' | 'name' | 'updated_at'>;

export interface IChatRepository {
  getChatsBy(where: Partial<ChatGetOutput>): Promise<ChatData[]>;
  createChat(data: ChatCreateInput): Promise<ChatData>;
  getChatById(chatId: string): Promise<ChatData>;
  updateChat(chatId: string, data: ChatUpdateInput): Promise<void>;
  deleteChat(chatId: string): Promise<void>;
}

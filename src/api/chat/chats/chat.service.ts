import { Injectable } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { UpdateChatDto } from './dto/update-chat.dto';
import { GetChatByIdOutput, GetUserNonArchivedChatsOutput } from './types/chat.service.types';
import { GetChatQueryDto } from './dto/chat.dto';
import { CreateChatDto } from './dto/create-chat.dto';
import { BranchContextRepository } from '../branch-contexts/branch-context.repository';
import { Transaction } from 'src/db/transactions/transaction.decorator';
import { generateRandomPastelHexColor } from 'src/shared/utils/generate-random-hex';

@Injectable()
export class ChatService {
  constructor(
    private chatRepository: ChatRepository,
    private branchContextRepository: BranchContextRepository,
  ) {}

  @Transaction()
  async createChat(userId: string, data: CreateChatDto): Promise<void> {
    let depth = 0;
    let rootChatId: string | undefined;
    let contextPath: string[] = [data.id];

    // A conversation was initialized in a branch
    if (data.branch_context) {
      const parentChat = await this.chatRepository.getChatById(data.branch_context.parent_chat_id);

      if (parentChat) {
        depth = parentChat.depth + 1;
        // parentChat may not have root_chat_id as parent might be the root itself
        rootChatId = parentChat.root_chat_id || data.branch_context.parent_chat_id;
        // parentChat.path = ['root_id', 'parent_chat_id']
        contextPath = [...parentChat.path, data.id];
      }
    }

    await this.chatRepository.createChat({
      depth,
      id: data.id,
      user_id: userId,
      name: data.name,
      path: contextPath,
      root_chat_id: rootChatId,
      folder_id: data.folder_id,
      parent_chat_id: data.branch_context?.parent_chat_id,
    });

    if (data.branch_context) {
      await this.branchContextRepository.createBranchContext({
        child_chat_id: data.id,
        context_type: data.branch_context?.context_type,
        end_position: data.branch_context?.end_position,
        connection_color: generateRandomPastelHexColor(),
        selected_text: data.branch_context?.selected_text,
        parent_chat_id: data.branch_context?.parent_chat_id,
        start_position: data.branch_context?.start_position,
        connection_type: data.branch_context?.connection_type,
        parent_message_id: data.branch_context?.parent_message_id,
      });
    }
  }

  getUserNonArchivedChats(userId: string, queryParams: GetChatQueryDto): Promise<GetUserNonArchivedChatsOutput[]> {
    // parent_chat_id and parent_folder_id are self excluding. There can be one or none of them
    return this.chatRepository.getChatsBy({
      user_id: userId,
      is_deleted: false,
      parent_chat_id: queryParams.parent_chat_id || null,
      folder_id: queryParams.parent_folder_id || null,
    });
  }

  getChatById(chatId: string): Promise<GetChatByIdOutput | undefined> {
    return this.chatRepository.getChatWithBranchContext(chatId);
  }

  async updateChat(chatId: string, data: UpdateChatDto): Promise<void> {
    await this.chatRepository.updateChat(chatId, { ...data, updated_at: new Date().toISOString() });
  }

  async deleteChat(chatId: string): Promise<void> {
    await this.chatRepository.updateChatsByPathChatId(chatId, { is_deleted: true, deleted_at: new Date().toISOString() });
  }
}

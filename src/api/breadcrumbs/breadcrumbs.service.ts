import { Injectable } from '@nestjs/common';
import { BreadcrumbsRepository } from './breadcrumbs.repository';
import { GetChatBreadcrumbsFolderT, GetChatBreadcrumbsOutput } from './types/breadcrumbs.service.types';

@Injectable()
export class BreadcrumbsService {
  constructor(private breadcrumbsRepository: BreadcrumbsRepository) {}

  async getChatBreadcrumbs(chatId: string): Promise<GetChatBreadcrumbsOutput> {
    const chatData = await this.breadcrumbsRepository.getChatById(chatId);

    if (!chatData) {
      throw new Error('Chat is not found');
    }

    let folders: GetChatBreadcrumbsFolderT[] = [];

    const chats = await this.breadcrumbsRepository.getChatsByIds(chatData.path);

    // chatData.folder_id means it's a root, but if it doesn't have it it's folder_id it's either a nested chat or doesn't have a folder.
    // chats[0].folder suspects we are in the nested chat and we check if the root is in a folder
    const folderId = chatData.folder_id || chats[0].folder_id;

    if (folderId) {
      const folderData = await this.breadcrumbsRepository.getFolderById(folderId);

      if (!folderData) {
        throw new Error('Folder is not found');
      }

      folders = await this.breadcrumbsRepository.getFoldersByIds(folderData?.path);
    }

    return {
      chats,
      folders,
    };
  }
}

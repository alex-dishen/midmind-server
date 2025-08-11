import { Injectable } from '@nestjs/common';
import { BreadcrumbsRepository } from './breadcrumbs.repository';
import { GetChatBreadcrumbsDirectoryT, GetChatBreadcrumbsOutput } from './types/breadcrumbs.service.types';

@Injectable()
export class BreadcrumbsService {
  constructor(private breadcrumbsRepository: BreadcrumbsRepository) {}

  async getChatBreadcrumbs(chatId: string): Promise<GetChatBreadcrumbsOutput> {
    const chatData = await this.breadcrumbsRepository.getChatById(chatId);

    if (!chatData) {
      throw new Error('Chat is not found');
    }

    let directories: GetChatBreadcrumbsDirectoryT[] = [];

    const chats = await this.breadcrumbsRepository.getChatsByIds(chatData.path);

    // chatData.directory_id means it's a root, but if it doesn't have it it's directory_id it's either a branch or doesn't have a directory.
    // chats[0].directory suspects we are in the branch and we check if the root is in a directory
    const directoryId = chatData.directory_id || chats[0].directory_id;

    if (directoryId) {
      const directoryData = await this.breadcrumbsRepository.getDirectoryById(directoryId);

      if (!directoryData) {
        throw new Error('Directory is not found');
      }

      directories = await this.breadcrumbsRepository.getDirectoriesByIds(directoryData?.path);
    }

    return {
      chats,
      directories,
    };
  }
}

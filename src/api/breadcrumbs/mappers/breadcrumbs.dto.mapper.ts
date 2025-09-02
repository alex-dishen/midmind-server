import { BreadcrumbType, ChatBreadcrumbsDto } from '../dto/chat-breadcrumbs.dto';
import { GetChatBreadcrumbsOutput } from '../types/breadcrumbs.service.types';

export class BreadcrumbsDtoMapper {
  static toChatBreadcrumbs({ chats, folders }: GetChatBreadcrumbsOutput): ChatBreadcrumbsDto[] {
    const mappedChats: ChatBreadcrumbsDto[] = chats.map(c => ({
      id: c.id,
      name: c.name,
      type: c.parent_chat_id ? BreadcrumbType.NESTED_CHAT : BreadcrumbType.CHAT,
    }));

    const mappedFolders: ChatBreadcrumbsDto[] = folders.map(d => ({
      id: d.id,
      name: d.name,
      type: BreadcrumbType.FOLDER,
    }));

    return [...mappedFolders, ...mappedChats];
  }
}

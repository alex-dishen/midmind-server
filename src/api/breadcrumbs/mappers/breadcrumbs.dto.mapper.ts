import { DirectoryType } from 'src/db/types/db.types';
import { BreadcrumbType, ChatBreadcrumbsDto } from '../dto/chat-breadcrumbs.dto';
import { GetChatBreadcrumbsOutput } from '../types/breadcrumbs.service.types';

export class BreadcrumbsDtoMapper {
  static toChatBreadcrumbs({ chats, directories }: GetChatBreadcrumbsOutput): ChatBreadcrumbsDto[] {
    const mappedChats: ChatBreadcrumbsDto[] = chats.map(c => ({
      id: c.id,
      name: c.name,
      type: c.parent_chat_id ? BreadcrumbType.BRANCH : BreadcrumbType.ROOT_CHAT,
    }));

    const mappedDirectories: ChatBreadcrumbsDto[] = directories.map(d => ({
      id: d.id,
      name: d.name,
      type: d.type === DirectoryType.FOLDER ? BreadcrumbType.FOLDER : BreadcrumbType.MINDLET,
    }));

    return [...mappedDirectories, ...mappedChats];
  }
}

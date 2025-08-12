import { ChatDto, GetChatDetailsDto } from '../dto/chat.dto';
import { GetChatByIdOutput, GetUserNonArchivedChatsOutput } from '../types/chat.service.types';

export class ChatDtoMapper {
  static toUserChatsDto(data: GetUserNonArchivedChatsOutput[]): ChatDto[] {
    return data.map(chat => ({
      id: chat.id,
      name: chat.name,
      has_children: chat.has_children,
      parent_directory_id: chat.directory_id,
    }));
  }

  static toChatDetailsDto(data: GetChatByIdOutput): GetChatDetailsDto {
    return {
      id: data.id,
      name: data.name,
    };
  }
}

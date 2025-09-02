import { ChatDto, GetChatDetailsDto } from '../dto/chat.dto';
import { GetChatByIdOutput, GetUserNonArchivedChatsOutput } from '../types/chat.service.types';

export class ChatDtoMapper {
  static toUserChatsDto(data: GetUserNonArchivedChatsOutput[]): ChatDto[] {
    return data.map(chat => ({
      id: chat.id,
      name: chat.name,
      has_children: chat.has_children,
      parent_folder_id: chat.folder_id,
      parent_chat_id: chat.parent_chat_id,
    }));
  }

  static toChatDetailsDto(data: GetChatByIdOutput): GetChatDetailsDto {
    const { id, name, parent_chat_id, parent_message_id } = data;
    let metadata = null;

    if (parent_chat_id && parent_message_id) {
      metadata = { parent_chat_id, parent_message_id };
    }

    return {
      id: id,
      name: name,
      metadata: metadata,
    };
  }
}

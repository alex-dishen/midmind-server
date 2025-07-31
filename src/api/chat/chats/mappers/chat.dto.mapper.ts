import { ChatDto } from '../dto/chat.dto';
import { GetUserNonArchivedChatsOutput } from '../types/chat.service.types';

export class ChatDtoMapper {
  static toUserChatsDto(data: GetUserNonArchivedChatsOutput[]): ChatDto[] {
    return data.map(chat => ({ id: chat.id, name: chat.name }));
  }
}

import { Injectable } from '@nestjs/common';
import { ChatMetadataRepository } from './chat-meatadata.repository';
import { UpdateChatMetadataDto } from './dto/update-chat-meatadata.dto';

@Injectable()
export class ChatMetadataService {
  constructor(private chatMetadataRepository: ChatMetadataRepository) {}

  async updateChatMetadataByChildChatId(childChatId: string, data: UpdateChatMetadataDto): Promise<void> {
    await this.chatMetadataRepository.updateChatMetadataByChildChatId(childChatId, data);
  }

  getChatMetadataByMessageId(messageId: string) {
    return this.chatMetadataRepository.getChatMetadataBy({ parent_message_id: messageId });
  }
}

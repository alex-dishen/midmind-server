import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/db/db.service';
import { ChatMetadataCreateInput, ChatMetadataGetOutput, ChatMetadataUpdateInput } from 'src/db/types/db.types';
import { GetChatMetadataByOutput } from './types/chat-meatadata.repository.types';

@Injectable()
export class ChatMetadataRepository {
  constructor(private kysely: DatabaseService) {}

  async createChatMetadata(data: ChatMetadataCreateInput): Promise<void> {
    await this.kysely.db.insertInto('chat_metadata').values(data).executeTakeFirstOrThrow();
  }

  async updateChatMetadataByChildChatId(childChatId: string, data: ChatMetadataUpdateInput): Promise<void> {
    await this.kysely.db.updateTable('chat_metadata').set(data).where('child_chat_id', '=', childChatId).execute();
  }

  getChatMetadataBy(where: Partial<ChatMetadataGetOutput>): Promise<GetChatMetadataByOutput[]> {
    let qb = this.kysely.db.selectFrom('chat_metadata');

    for (const [key, value] of Object.entries(where)) {
      qb = qb.where(key as keyof ChatMetadataGetOutput, '=', value);
    }

    return qb
      .select(['id', 'child_chat_id', 'connection_type', 'connection_color', 'context_type', 'end_position', 'start_position'])
      .execute();
  }
}

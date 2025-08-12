import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/db/db.service';
import { MessageReplyCreateInput } from 'src/db/types/db.types';

@Injectable()
export class MessageReplyRepository {
  constructor(private kysely: DatabaseService) {}

  async createMessageReply(data: MessageReplyCreateInput): Promise<void> {
    await this.kysely.db.insertInto('message_replies').values(data).execute();
  }
}

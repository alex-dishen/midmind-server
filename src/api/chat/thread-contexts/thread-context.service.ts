import { Injectable } from '@nestjs/common';
import { ThreadContextRepository } from './thread-context.repository';

@Injectable()
export class ThreadContextService {
  constructor(private threadContextRepository: ThreadContextRepository) {}

  getThreadContextByMessageId(messageId: string) {
    return this.threadContextRepository.getThreadContextBy({ parent_message_id: messageId });
  }
}

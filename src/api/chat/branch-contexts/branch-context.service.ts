import { Injectable } from '@nestjs/common';
import { BranchContextRepository } from './branch-context.repository';

@Injectable()
export class BranchContextService {
  constructor(private branchContextRepository: BranchContextRepository) {}

  getBranchContextByMessageId(messageId: string) {
    return this.branchContextRepository.getBranchContextBy({ parent_message_id: messageId });
  }
}

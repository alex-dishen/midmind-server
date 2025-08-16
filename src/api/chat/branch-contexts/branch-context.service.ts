import { Injectable } from '@nestjs/common';
import { BranchContextRepository } from './branch-context.repository';
import { UpdateBranchContextDto } from './dto/update-branch-context.dto';

@Injectable()
export class BranchContextService {
  constructor(private branchContextRepository: BranchContextRepository) {}

  async updateBranchContextByChildChatId(childChatId: string, data: UpdateBranchContextDto): Promise<void> {
    await this.branchContextRepository.updateBranchContextByChildChatId(childChatId, data);
  }

  getBranchContextByMessageId(messageId: string) {
    return this.branchContextRepository.getBranchContextBy({ parent_message_id: messageId });
  }
}

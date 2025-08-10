import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/db/db.service';
import { GetBranchContextByOutput } from './types/branch-context.repository.types';
import { BranchContextCreateInput, BranchContextGetOutput } from 'src/db/types/db.types';

@Injectable()
export class BranchContextRepository {
  constructor(private kysely: DatabaseService) {}

  async createBranchContext(data: BranchContextCreateInput): Promise<void> {
    await this.kysely.db.insertInto('branch_contexts').values(data).executeTakeFirstOrThrow();
  }

  getBranchContextBy(where: Partial<BranchContextGetOutput>): Promise<GetBranchContextByOutput[]> {
    let qb = this.kysely.db.selectFrom('branch_contexts');

    for (const [key, value] of Object.entries(where)) {
      qb = qb.where(key as keyof BranchContextGetOutput, '=', value);
    }

    return qb
      .select(['id', 'child_chat_id', 'connection_type', 'connection_color', 'context_type', 'end_position', 'start_position'])
      .execute();
  }
}

import { BranchContextGetOutput } from 'src/db/types/db.types';

export type GetBranchContextByOutput = Pick<
  BranchContextGetOutput,
  'id' | 'connection_color' | 'context_type' | 'end_position' | 'start_position' | 'connection_type' | 'child_chat_id'
>;

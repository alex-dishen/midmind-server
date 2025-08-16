import { ChatGetOutput } from 'src/db/types/db.types';

export type GetChatsByOutput = Pick<ChatGetOutput, 'id' | 'name' | 'directory_id'> & { has_children: boolean };

export type GetChatByIdOutput = Pick<ChatGetOutput, 'id' | 'name' | 'depth' | 'root_chat_id' | 'path'>;

export type GetChatWithBranchContextOutput = Pick<ChatGetOutput, 'id' | 'name'> & {
  parent_chat_id: string | null;
  parent_message_id: string | null;
};

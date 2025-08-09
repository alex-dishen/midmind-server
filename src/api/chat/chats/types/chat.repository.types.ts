import { ChatGetOutput } from 'src/db/types/db.types';

export type ChatData = Pick<ChatGetOutput, 'id' | 'name' | 'depth'>;

export type GetChatByIdOutput = Pick<ChatGetOutput, 'id' | 'name' | 'depth' | 'root_chat_id' | 'path'>;

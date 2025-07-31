import { ChatGetOutput } from 'src/db/types/db.types';

export type ChatData = Pick<ChatGetOutput, 'id' | 'name' | 'thread_level'>;

export type GetChatByIdOutput = Pick<ChatGetOutput, 'id' | 'name' | 'thread_level' | 'root_chat_id' | 'path'>;

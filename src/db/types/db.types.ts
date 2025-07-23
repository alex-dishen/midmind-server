// Auto-generated CRUD types for Kysely
// Generated at 2025-07-23T06:37:02.622Z

import type { ColumnType, Generated, Selectable, Insertable, Updateable } from 'kysely';

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
}

export enum UserProvider {
  GOOGLE = 'GOOGLE',
}

export enum MessageSender {
  SYSTEM = 'SYSTEM',
  USER = 'USER',
}

export type UserTable = {
  id: Generated<string>;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
  password: string | null;
  provider: UserProvider | null;
  provider_id: string | null;
  created_at: ColumnType<Date, Date | string | undefined, Date | string>;
  updated_at: ColumnType<Date, Date | string | undefined, Date | string>;
};
export type UserGetOutput = Selectable<UserTable>;
export type UserCreateInput = Insertable<UserTable>;
export type UserUpdateInput = Updateable<UserTable>;

export type ChatTable = {
  id: Generated<string>;
  name: string | null;
  created_at: ColumnType<Date, Date | string | undefined, Date | string>;
  user_id: string;
  updated_at: ColumnType<Date, Date | string | undefined, Date | string>;
  is_deleted: Generated<boolean>;
  deleted_at: ColumnType<Date, Date | string | undefined, Date | string>;
};
export type ChatGetOutput = Selectable<ChatTable>;
export type ChatCreateInput = Insertable<ChatTable>;
export type ChatUpdateInput = Updateable<ChatTable>;

export type MessageTable = {
  id: Generated<string>;
  content: string;
  type: Generated<MessageType>;
  chat_id: string;
  user_id: string | null;
  llm_model: string | null;
  sender_type: MessageSender;
  parent_message_id: string | null;
  response_message_id: string | null;
  created_at: ColumnType<Date, Date | string | undefined, Date | string>;
};
export type MessageGetOutput = Selectable<MessageTable>;
export type MessageCreateInput = Insertable<MessageTable>;
export type MessageUpdateInput = Updateable<MessageTable>;

export type DB = {
  users: UserTable;
  chats: ChatTable;
  messages: MessageTable;
};

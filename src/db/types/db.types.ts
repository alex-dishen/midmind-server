// Auto-generated CRUD types for Kysely
// Generated at 2025-07-24T17:14:47.128Z

import type { ColumnType, Generated, Selectable, Insertable, Updateable } from 'kysely';

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  AUDIO = 'audio',
  VIDEO = 'video',
}

export enum UserProvider {
  GOOGLE = 'google',
}

export enum MessageSenderRole {
  MODEL = 'model',
  USER = 'user',
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
  role: MessageSenderRole;
  parent_message_id: string | null;
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

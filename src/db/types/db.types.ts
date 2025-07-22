// Auto-generated CRUD types for Kysely
// Generated at 2025-07-22T05:51:53.437Z

import type { ColumnType, Generated, Selectable, Insertable, Updateable } from 'kysely';

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
  SYSTEM = 'SYSTEM',
}

export enum UserProvider {
  GOOGLE = 'GOOGLE',
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
  description: string | null;
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
  user_id: string;
  created_at: ColumnType<Date, Date | string | undefined, Date | string>;
  updated_at: ColumnType<Date, Date | string | undefined, Date | string>;
  is_edited: Generated<boolean>;
  edited_at: ColumnType<Date, Date | string | undefined, Date | string>;
  is_deleted: Generated<boolean>;
  deleted_at: ColumnType<Date, Date | string | undefined, Date | string>;
};
export type MessageGetOutput = Selectable<MessageTable>;
export type MessageCreateInput = Insertable<MessageTable>;
export type MessageUpdateInput = Updateable<MessageTable>;

export type AttachmentTable = {
  id: Generated<string>;
  file_name: string;
  file_size: number;
  mime_type: string;
  url: string;
  message_id: string;
  created_at: ColumnType<Date, Date | string | undefined, Date | string>;
};
export type AttachmentGetOutput = Selectable<AttachmentTable>;
export type AttachmentCreateInput = Insertable<AttachmentTable>;
export type AttachmentUpdateInput = Updateable<AttachmentTable>;

export type DB = {
  users: UserTable;
  chats: ChatTable;
  messages: MessageTable;
  attachments: AttachmentTable;
};

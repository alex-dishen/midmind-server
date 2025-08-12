// Auto-generated CRUD types for Kysely
// Generated at 2025-08-12T07:06:33.575Z

import type { ColumnType, Generated, Selectable, Insertable, Updateable } from 'kysely';

export enum UserProvider {
  GOOGLE = 'google',
}

export enum MessageSenderRole {
  MODEL = 'model',
  USER = 'user',
}

export enum ConnectionType {
  ATTACHED = 'attached',
  DETACHED = 'detached',
  TEMPORARY = 'temporary',
}

export enum ContextType {
  FULL_MESSAGE = 'full_message',
  TEXT_SELECTION = 'text_selection',
}

export enum DirectoryType {
  FOLDER = 'folder',
  MINDLET = 'mindlet',
}

type UserTable = {
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

type DirectoryTable = {
  id: Generated<string>;
  root_directory_id: string | null;
  parent_directory_id: string | null;
  user_id: string;
  name: string;
  depth: Generated<number>;
  created_at: ColumnType<Date, Date | string | undefined, Date | string>;
  updated_at: ColumnType<Date, Date | string | undefined, Date | string>;
  is_deleted: Generated<boolean>;
  deleted_at: ColumnType<Date, Date | string | undefined, Date | string>;
  type: DirectoryType;
  path: string[];
};
export type DirectoryGetOutput = Selectable<DirectoryTable>;
export type DirectoryCreateInput = Insertable<DirectoryTable>;
export type DirectoryUpdateInput = Updateable<DirectoryTable>;

type ChatTable = {
  id: Generated<string>;
  parent_chat_id: string | null;
  user_id: string;
  root_chat_id: string | null;
  directory_id: string | null;
  name: string;
  depth: Generated<number>;
  created_at: ColumnType<Date, Date | string | undefined, Date | string>;
  updated_at: ColumnType<Date, Date | string | undefined, Date | string>;
  is_deleted: Generated<boolean>;
  deleted_at: ColumnType<Date, Date | string | undefined, Date | string>;
  position_y: Generated<number>;
  position_x: Generated<number>;
  path: string[];
};
export type ChatGetOutput = Selectable<ChatTable>;
export type ChatCreateInput = Insertable<ChatTable>;
export type ChatUpdateInput = Updateable<ChatTable>;

type MessageTable = {
  id: Generated<string>;
  parent_message_id: string | null;
  chat_id: string;
  user_id: string | null;
  content: string;
  llm_model: string | null;
  role: MessageSenderRole;
  created_at: ColumnType<Date, Date | string | undefined, Date | string>;
};
export type MessageGetOutput = Selectable<MessageTable>;
export type MessageCreateInput = Insertable<MessageTable>;
export type MessageUpdateInput = Updateable<MessageTable>;

type MessageReplyTable = {
  id: Generated<string>;
  message_id: string;
  message_id_replied_to: string;
  reply_content: string;
};
export type MessageReplyGetOutput = Selectable<MessageReplyTable>;
export type MessageReplyCreateInput = Insertable<MessageReplyTable>;
export type MessageReplyUpdateInput = Updateable<MessageReplyTable>;

type BranchContextTable = {
  id: Generated<string>;
  child_chat_id: string;
  parent_chat_id: string;
  parent_message_id: string;
  child_message_id: string;
  selected_text: string | null;
  start_position: number | null;
  end_position: number | null;
  created_at: ColumnType<Date, Date | string | undefined, Date | string>;
  context_type: ContextType;
  connection_type: ConnectionType;
  connection_color: string;
};
export type BranchContextGetOutput = Selectable<BranchContextTable>;
export type BranchContextCreateInput = Insertable<BranchContextTable>;
export type BranchContextUpdateInput = Updateable<BranchContextTable>;

export type DB = {
  users: UserTable;
  directories: DirectoryTable;
  chats: ChatTable;
  messages: MessageTable;
  message_replies: MessageReplyTable;
  branch_contexts: BranchContextTable;
};

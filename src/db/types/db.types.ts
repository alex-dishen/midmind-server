// Auto-generated CRUD types for Kysely
// Generated at 2025-08-30T08:56:49.339Z

import type { ColumnType, Generated, Selectable, Insertable, Updateable } from 'kysely';

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

export enum FileStatus {
  PENDING_UPLOAD = 'pending_upload',
  UPLOADED = 'uploaded',
}

export enum FileCategory {
  IMAGE = 'image',
  DOCUMENT = 'document',
}

export enum FileBindingType {
  MESSAGE = 'message',
}

export enum UserProvider {
  GOOGLE = 'google',
}

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
  child_message_id: string | null;
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

type FileTable = {
  id: Generated<string>;
  bucket: string;
  object_key: string;
  original_filename: string;
  extension: string;
  mime_type: string;
  category: FileCategory;
  size_bytes: bigint;
  status: Generated<FileStatus>;
  uploader_id: string;
  created_at: ColumnType<Date, Date | string | undefined, Date | string>;
};
export type FileGetOutput = Selectable<FileTable>;
export type FileCreateInput = Insertable<FileTable>;
export type FileUpdateInput = Updateable<FileTable>;

type FileBindingTable = {
  id: Generated<string>;
  file_id: string;
  target_type: FileBindingType;
  target_id: string;
  created_at: ColumnType<Date, Date | string | undefined, Date | string>;
};
export type FileBindingGetOutput = Selectable<FileBindingTable>;
export type FileBindingCreateInput = Insertable<FileBindingTable>;
export type FileBindingUpdateInput = Updateable<FileBindingTable>;

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

export type DB = {
  chats: ChatTable;
  messages: MessageTable;
  message_replies: MessageReplyTable;
  branch_contexts: BranchContextTable;
  directories: DirectoryTable;
  files: FileTable;
  file_bindings: FileBindingTable;
  users: UserTable;
};

// Auto-generated CRUD types for Kysely
// Generated at 2025-07-07T16:53:06.332Z

import type { ColumnType, Generated, Selectable, Insertable, Updateable } from 'kysely';

export enum ChatType {
  DIRECT = 'DIRECT',
  GROUP = 'GROUP',
}

export enum ChatRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
  SYSTEM = 'SYSTEM',
}

export type UserTable = {
  id: Generated<string>;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
  password: string;
  is_online: Generated<boolean>;
  last_seen: ColumnType<Date, Date | string | undefined, Date | string>;
  created_at: ColumnType<Date, Date | string | undefined, Date | string>;
  updated_at: ColumnType<Date, Date | string | undefined, Date | string>;
};
export type UserGetOutput = Selectable<UserTable>;
export type UserCreateInput = Insertable<UserTable>;
export type UserUpdateInput = Updateable<UserTable>;

export type ChatTable = {
  id: Generated<string>;
  name: string | null;
  type: Generated<ChatType>;
  avatar: string | null;
  created_at: ColumnType<Date, Date | string | undefined, Date | string>;
  updated_at: ColumnType<Date, Date | string | undefined, Date | string>;
  description: string | null;
  is_archived: Generated<boolean>;
};
export type ChatGetOutput = Selectable<ChatTable>;
export type ChatCreateInput = Insertable<ChatTable>;
export type ChatUpdateInput = Updateable<ChatTable>;

export type ChatParticipantTable = {
  id: Generated<string>;
  user_id: string;
  chat_id: string;
  role: Generated<ChatRole>;
  joined_at: ColumnType<Date, Date | string | undefined, Date | string>;
  is_active: Generated<boolean>;
};
export type ChatParticipantGetOutput = Selectable<ChatParticipantTable>;
export type ChatParticipantCreateInput = Insertable<ChatParticipantTable>;
export type ChatParticipantUpdateInput = Updateable<ChatParticipantTable>;

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
  reply_to_id: string | null;
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

export type ReactionTable = {
  id: Generated<string>;
  emoji: string;
  message_id: string;
  user_id: string;
  created_at: ColumnType<Date, Date | string | undefined, Date | string>;
};
export type ReactionGetOutput = Selectable<ReactionTable>;
export type ReactionCreateInput = Insertable<ReactionTable>;
export type ReactionUpdateInput = Updateable<ReactionTable>;

export type DB = {
  users: UserTable;
  chats: ChatTable;
  chat_participants: ChatParticipantTable;
  messages: MessageTable;
  attachments: AttachmentTable;
  reactions: ReactionTable;
};

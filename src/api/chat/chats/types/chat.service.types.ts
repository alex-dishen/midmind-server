export type GetUserNonArchivedChatsOutput = {
  id: string;
  name: string;
  directory_id: string | null;
  has_children: boolean;
};

export type GetChatByIdOutput = {
  id: string;
  name: string;
  parent_chat_id: string | null;
  parent_message_id: string | null;
};

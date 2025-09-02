export type GetUserNonArchivedChatsOutput = {
  id: string;
  name: string;
  folder_id: string | null;
  has_children: boolean;
  parent_chat_id: string | null;
};

export type GetChatByIdOutput = {
  id: string;
  name: string;
  parent_chat_id: string | null;
  parent_message_id: string | null;
};

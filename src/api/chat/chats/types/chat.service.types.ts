export type GetUserNonArchivedChatsOutput = {
  id: string;
  name: string;
  directory_id: string | null;
  has_children: boolean;
};

export type GetChatByIdOutput = {
  id: string;
  name: string;
  depth: number;
  path: string[];
  root_chat_id: string | null;
};

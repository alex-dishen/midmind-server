export type GetUserNonArchivedChatsOutput = {
  id: string;
  name: string;
  directory_id: string | null;
  has_children: boolean;
};

export type GetChatByIdOutput = {
  id: string;
  path: string[];
  name: string | null;
  depth: number;
  root_chat_id: string | null;
};

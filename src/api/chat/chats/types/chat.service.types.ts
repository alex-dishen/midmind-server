export type GetUserNonArchivedChatsOutput = {
  id: string;
  name: string | null;
  depth: number;
};

export type GetChatByIdOutput = {
  id: string;
  path: string[];
  name: string | null;
  depth: number;
  root_chat_id: string | null;
};

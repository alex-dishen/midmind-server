export type GetUserNonArchivedChatsOutput = {
  id: string;
  name: string | null;
  thread_level: number;
};

export type GetChatByIdOutput = {
  id: string;
  path: string[];
  name: string | null;
  thread_level: number;
  root_chat_id: string | null;
};

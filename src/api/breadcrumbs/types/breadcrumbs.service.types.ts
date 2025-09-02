export type GetChatBreadcrumbsFolderT = {
  id: string;
  name: string;
};

export type GetChatBreadcrumbsOutput = {
  chats: {
    id: string;
    name: string;
    parent_chat_id: string | null;
  }[];
  folders: GetChatBreadcrumbsFolderT[];
};

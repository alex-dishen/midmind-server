import { DirectoryType } from 'src/db/types/db.types';

export type GetChatBreadcrumbsDirectoryT = {
  id: string;
  name: string;
  type: DirectoryType;
};

export type GetChatBreadcrumbsOutput = {
  chats: {
    id: string;
    name: string;
    parent_chat_id: string | null;
  }[];
  directories: GetChatBreadcrumbsDirectoryT[];
};

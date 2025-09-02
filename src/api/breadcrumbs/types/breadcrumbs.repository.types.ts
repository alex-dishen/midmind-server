import { ChatGetOutput, FolderGetOutput } from 'src/db/types/db.types';

export type GetFolderForBreadcrumbsOutput = Pick<FolderGetOutput, 'path'>;

export type GetFoldersByIdsForBreadcrumbsOutput = Pick<FolderGetOutput, 'id' | 'name'>;

export type GetChatByIdForBreadcrumbsOutput = Pick<ChatGetOutput, 'path' | 'folder_id'>;

export type GetChatsByIdsForBreadcrumbsOutput = Pick<ChatGetOutput, 'id' | 'name' | 'parent_chat_id' | 'folder_id'>;

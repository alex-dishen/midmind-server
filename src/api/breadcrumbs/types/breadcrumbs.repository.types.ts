import { ChatGetOutput, DirectoryGetOutput } from 'src/db/types/db.types';

export type GetDirectoryForBreadcrumbsOutput = Pick<DirectoryGetOutput, 'path'>;

export type GetDirectoriesByIdsForBreadcrumbsOutput = Pick<DirectoryGetOutput, 'id' | 'name' | 'type'>;

export type GetChatByIdForBreadcrumbsOutput = Pick<ChatGetOutput, 'path' | 'directory_id'>;

export type GetChatsByIdsForBreadcrumbsOutput = Pick<ChatGetOutput, 'id' | 'name' | 'parent_chat_id' | 'directory_id'>;

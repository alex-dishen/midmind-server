import { FolderGetOutput } from 'src/db/types/db.types';

export type GetFoldersGetOutput = Pick<FolderGetOutput, 'id' | 'name'> & { has_children: boolean };

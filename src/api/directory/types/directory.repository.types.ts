import { DirectoryGetOutput } from 'src/db/types/db.types';

export type GetDirectoriesGetOutput = Pick<DirectoryGetOutput, 'id' | 'name' | 'type'> & { has_children: boolean };

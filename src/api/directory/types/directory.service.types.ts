import { DirectoryType } from 'src/db/types/db.types';

export type GetDirectoriesByParentIdOutput = {
  id: string;
  name: string;
  type: DirectoryType;
  has_children: boolean;
};

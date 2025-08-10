import { IsOptional, IsUUID } from 'class-validator';
import { DirectoryType } from 'src/db/types/db.types';

export class GetDirectoryQueryDto {
  @IsUUID()
  @IsOptional()
  parent_id?: string;
}

export class GetDirectoryDto {
  @IsUUID()
  id: string;

  name: string;
  type: DirectoryType;
  has_children: boolean;
}

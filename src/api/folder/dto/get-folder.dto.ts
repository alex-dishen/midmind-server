import { IsOptional, IsUUID } from 'class-validator';

export class GetFolderQueryDto {
  @IsUUID()
  @IsOptional()
  parent_id?: string;
}

export class GetFolderDto {
  @IsUUID()
  id: string;

  name: string;
  has_children: boolean;
}

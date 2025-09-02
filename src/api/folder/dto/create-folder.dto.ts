import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateFolderDto {
  @IsUUID()
  id: string;

  @IsUUID()
  @IsOptional()
  parent_folder_id?: string;

  @IsString()
  name: string;
}

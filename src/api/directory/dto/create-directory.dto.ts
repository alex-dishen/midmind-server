import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { DirectoryType } from 'src/db/types/db.types';

export class CreateDirectoryDto {
  @IsUUID()
  id: string;

  @IsUUID()
  @IsOptional()
  parent_directory_id?: string;

  @IsString()
  name: string;

  @IsEnum(DirectoryType)
  type: DirectoryType;
}

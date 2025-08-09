import { IsEnum, IsOptional, IsString } from 'class-validator';
import { DirectoryType } from 'src/db/types/db.types';

export class UpdateDirectoryDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsEnum(DirectoryType)
  @IsOptional()
  type: DirectoryType;
}

import { IsOptional, IsUUID } from 'class-validator';

export class ChangeDirectoryLocationRequestDto {
  @IsUUID()
  @IsOptional()
  target_parent_id?: string;
}

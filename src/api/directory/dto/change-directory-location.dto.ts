import { IsUUID, ValidateIf } from 'class-validator';
export class ChangeDirectoryLocationRequestDto {
  @ValidateIf((_, value) => value !== null) // skip UUID check when explicitly null
  @IsUUID('4', { message: 'target_parent_id must be a valid UUID or null' })
  target_parent_id: string | null;
}

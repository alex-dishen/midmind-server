import { IsOptional, IsString, IsUUID, ValidateIf } from 'class-validator';

export class UpdateChatDto {
  @IsOptional()
  @IsString()
  name?: string;

  @ValidateIf((_, value) => value !== null) // skip UUID check when explicitly null
  @IsUUID('4', { message: "target_parent_id must be a valid UUID or null or shouldn't be passed at all" })
  @IsOptional()
  folder_id?: string | null;
}

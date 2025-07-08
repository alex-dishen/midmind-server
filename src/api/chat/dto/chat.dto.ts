import { ChatType } from 'src/db/types/db.types';
import { IsString, IsOptional, IsUUID, IsEnum } from 'class-validator';

export class ChatDto {
  @IsUUID()
  id: string;

  type: ChatType;
  created_at: Date;
  name: string | null;
  is_archived: boolean;
  avatar: string | null;
  updated_at: Date | null;
  description: string | null;
}

export class CreateChatDto {
  @IsEnum(ChatType)
  type?: ChatType;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateChatDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

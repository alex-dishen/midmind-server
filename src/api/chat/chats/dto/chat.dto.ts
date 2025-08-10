import { IsOptional, IsUUID } from 'class-validator';

export class GetChatQueryDto {
  @IsUUID()
  @IsOptional()
  parent_directory_id?: string;

  @IsUUID()
  @IsOptional()
  parent_chat_id?: string;
}

export class ChatDto {
  @IsUUID()
  id: string;

  name: string;
  parent_directory_id: string | null;
  has_children: boolean;
}

import { IsOptional, IsUUID } from 'class-validator';

export class GetChatQueryDto {
  @IsUUID()
  @IsOptional()
  parent_folder_id?: string;

  @IsUUID()
  @IsOptional()
  parent_chat_id?: string;
}

class ChatDetailsMetadata {
  @IsUUID()
  parent_message_id: string;
  @IsUUID()
  parent_chat_id: string;
}

export class GetChatDetailsDto {
  @IsUUID()
  id: string;
  name: string;
  metadata: ChatDetailsMetadata | null;
}

export class ChatDto {
  @IsUUID()
  id: string;

  name: string;
  has_children: boolean;
  parent_chat_id: string | null;
  parent_folder_id: string | null;
}

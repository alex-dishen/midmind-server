import { IsUUID } from 'class-validator';

export enum BreadcrumbType {
  FOLDER = 'folder',
  MINDLET = 'mindlet',
  CHAT = 'chat',
  NESTED_CHAT = 'nested_chat',
}

export class ChatBreadcrumbsDto {
  @IsUUID()
  id: string;

  name: string;
  type: BreadcrumbType;
}

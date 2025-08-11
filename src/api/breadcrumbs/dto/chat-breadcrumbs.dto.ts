import { IsUUID } from 'class-validator';

export enum BreadcrumbType {
  FOLDER = 'folder',
  MINDLET = 'mindlet',
  ROOT_CHAT = 'root_chat',
  BRANCH = 'branch',
}

export class ChatBreadcrumbsDto {
  @IsUUID()
  id: string;

  name: string;
  type: BreadcrumbType;
}

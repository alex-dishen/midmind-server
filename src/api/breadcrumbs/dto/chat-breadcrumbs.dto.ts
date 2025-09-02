import { IsUUID } from 'class-validator';
import { EntityEnum } from 'src/shared/enums/entities';

export class ChatBreadcrumbsDto {
  @IsUUID()
  id: string;

  name: string;
  type: EntityEnum;
}

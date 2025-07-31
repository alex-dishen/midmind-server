import { IsUUID } from 'class-validator';

export class ChatDto {
  @IsUUID()
  id: string;

  name: string | null;
}

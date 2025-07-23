import { IsUUID } from 'class-validator';

export class ChatDto {
  @IsUUID()
  id: string;

  created_at: Date;
  name: string | null;
  updated_at: Date | null;
}

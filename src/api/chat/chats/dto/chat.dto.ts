import { IsUUID } from 'class-validator';

export class ChatDto {
  @IsUUID()
  id: string;

  created_at: Date;
  name: string | null;
  is_deleted: boolean;
  updated_at: Date | null;
  deleted_at: Date | null;
  description: string | null;
}

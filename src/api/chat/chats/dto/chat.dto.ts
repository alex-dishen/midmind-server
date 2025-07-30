import { IsUUID } from 'class-validator';

export class ChatDto {
  @IsUUID()
  id: string;

  created_at: Date;
  name: string | null;
  thread_level: number;
  updated_at: Date | null;
}

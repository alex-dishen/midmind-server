import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsUUID } from 'class-validator';

export class ChatDto {
  @IsUUID()
  id: string;

  created_at: Date;
  name: string | null;

  @Exclude()
  @ApiHideProperty()
  is_deleted?: boolean;

  updated_at: Date | null;

  @Exclude()
  @ApiHideProperty()
  deleted_at?: Date | null;
  description: string | null;
}

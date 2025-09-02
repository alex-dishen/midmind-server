import { IsEnum, IsOptional } from 'class-validator';
import { ConnectionType } from 'src/db/types/db.types';

export class UpdateChatMetadataDto {
  @IsEnum(ConnectionType)
  @IsOptional()
  connection_type?: ConnectionType;
}

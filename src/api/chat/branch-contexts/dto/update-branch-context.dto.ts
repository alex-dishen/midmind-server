import { IsEnum, IsOptional } from 'class-validator';
import { ConnectionType } from 'src/db/types/db.types';

export class UpdateBranchContextDto {
  @IsEnum(ConnectionType)
  @IsOptional()
  connection_type?: ConnectionType;
}

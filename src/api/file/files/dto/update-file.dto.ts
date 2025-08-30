import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, IsPositive, IsEnum } from 'class-validator';
import { FileStatus } from 'src/db/types/db.types';

export class FileUpdateDto {
  @ApiPropertyOptional({
    description: 'Actual file size after upload (for verification)',
    example: 1024000,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  actual_size_bytes?: number;

  @IsOptional()
  @IsEnum(FileStatus)
  status?: FileStatus;
}

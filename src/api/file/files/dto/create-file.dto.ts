import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsPositive, Max } from 'class-validator';

enum AllowedMemeType {
  IMAGE_PNG = 'image/png',
  IMAGE_JPEG = 'image/jpeg',
  IMAGE_WEBP = 'image/webp',
}

export class FileCreateDto {
  @IsString()
  original_filename: string;

  @IsInt()
  @IsPositive()
  @Max(50 * 1024 * 1024) // 50MB max
  size_bytes: number;

  @ApiProperty({
    description: 'MIME type of the file',
    example: 'image/jpeg',
  })
  @IsString()
  mime_type: AllowedMemeType;

  @IsString()
  extension: string;
}

export class FileCreateResponseDto {
  file_id: string;
  upload_url: string;
}

import { Controller, Post, Param, Body, UseGuards, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileService } from './file.service';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { MessageDto } from 'src/shared/dtos/message.dto';
import { FileCreateDto, FileCreateResponseDto } from './dto/create-file.dto';
import { FileUpdateDto } from './dto/update-file.dto';

@ApiTags('Files')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('files')
export class FileController {
  constructor(private fileService: FileService) {}

  @ApiOperation({ summary: 'Initialize file upload' })
  @Post()
  async createFileRecord(@GetUser('sub') userId: string, @Body() data: FileCreateDto): Promise<FileCreateResponseDto> {
    const result = await this.fileService.createFileRecord(userId, data);

    return { file_id: result.fileId, upload_url: result.uploadUrl };
  }

  @ApiOperation({ summary: 'Finalize file upload' })
  @Put('/:id')
  async updateFile(@Param('id') fileId: string, @Body() data: FileUpdateDto): Promise<MessageDto> {
    await this.fileService.updateFile(fileId, data);

    return { message: 'File updated successfully' };
  }
}

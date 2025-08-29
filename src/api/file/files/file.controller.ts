import { FileService } from './file.service';
import { GetFileDto } from './dto/get-file.dto';
import { FileUpdateDto } from './dto/update-file.dto';
import { MessageDto } from 'src/shared/dtos/message.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileCreateDto, FileCreateResponseDto } from './dto/create-file.dto';
import { Controller, Post, Param, Body, UseGuards, Put, Get } from '@nestjs/common';

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

  @ApiOperation({ summary: 'Get file to display' })
  @Get('/:id')
  async getFile(@Param('id') fileId: string): Promise<GetFileDto> {
    return this.fileService.getFileById(fileId);
  }
}

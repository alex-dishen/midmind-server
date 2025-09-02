import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { MessageDto } from 'src/shared/dtos/message.dto';
import { FolderService } from './folder.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { ChangeFolderLocationRequestDto } from './dto/change-folder-location.dto';
import { GetFolderDto, GetFolderQueryDto } from './dto/get-folder.dto';

@ApiTags('Folders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('folders')
export class FolderController {
  constructor(private folderService: FolderService) {}

  @ApiOperation({ summary: 'Create a folder' })
  @Post()
  async createFolder(@GetUser('sub') userId: string, @Body() data: CreateFolderDto): Promise<MessageDto> {
    await this.folderService.createFolder(userId, data);

    return { message: 'Folder was created' };
  }

  @ApiOperation({ summary: 'Update a folder' })
  @Put('/:id')
  async updateFolder(@Param('id') folderId: string, @Body() data: UpdateFolderDto): Promise<MessageDto> {
    await this.folderService.updateFolder(folderId, data);

    return { message: 'Folder was updated' };
  }

  @ApiOperation({ summary: 'Change folder location' })
  @Put('/:id/location')
  async changeFolderLocation(@Param('id') folderId: string, @Body() data: ChangeFolderLocationRequestDto): Promise<MessageDto> {
    await this.folderService.changeFolderLocation(folderId, data);

    return { message: 'Folder changed its location' };
  }

  @ApiOperation({ summary: 'Get root or nested folders by passing or omitting parentId param' })
  @Get()
  async getFolders(@GetUser('sub') userId: string, @Query() query: GetFolderQueryDto): Promise<GetFolderDto[]> {
    return this.folderService.getFoldersByParentId(userId, query.parent_id);
  }

  @ApiOperation({ summary: 'Delete a folder' })
  @Delete('/:id')
  async deleteFolder(@Param('id') folderId: string): Promise<MessageDto> {
    await this.folderService.deleteFolder(folderId);

    return { message: 'Folder was deleted' };
  }
}

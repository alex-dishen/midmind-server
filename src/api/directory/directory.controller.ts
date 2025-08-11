import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CreateDirectoryDto } from './dto/create-direcotry.dto';
import { DirectoryService } from './directory.service';
import { UpdateDirectoryDto } from './dto/update-directory.dto';
import { MessageDto } from 'src/shared/dtos/message.dto';
import { ChangeDirectoryLocationRequestDto } from './dto/change-directory-location.dto';
import { GetDirectoryDto, GetDirectoryQueryDto } from './dto/get-directory.dto';

@ApiTags('Directories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('directories')
export class DirectoryController {
  constructor(private directoryService: DirectoryService) {}

  @ApiOperation({ summary: 'Create a directory' })
  @Post()
  async createDirectory(@GetUser('sub') userId: string, @Body() data: CreateDirectoryDto): Promise<MessageDto> {
    await this.directoryService.createDirectory(userId, data);

    return { message: 'Directory was created' };
  }

  @ApiOperation({ summary: 'Update a directory' })
  @Put('/:id')
  async updateDirectory(@Param('id') directoryId: string, @Body() data: UpdateDirectoryDto): Promise<MessageDto> {
    await this.directoryService.updateDirectory(directoryId, data);

    return { message: 'Directory was updated' };
  }

  @ApiOperation({ summary: 'Change directory location' })
  @Put('/:id/location')
  async changeDirectoryLocation(
    @Param('id') directoryId: string,
    @Body() data: ChangeDirectoryLocationRequestDto,
  ): Promise<MessageDto> {
    await this.directoryService.changeDirectoryLocation(directoryId, data);

    return { message: 'Directory changed its location' };
  }

  @ApiOperation({ summary: 'Get root or nested directories by passing or omitting parentId param' })
  @Get()
  async getDirectories(@GetUser('sub') userId: string, @Query() query: GetDirectoryQueryDto): Promise<GetDirectoryDto[]> {
    return this.directoryService.getDirectoriesByParentId(userId, query.parent_id);
  }

  @ApiOperation({ summary: 'Delete a directory' })
  @Delete('/:id')
  async deleteDirectory(@Param('id') directoryId: string): Promise<MessageDto> {
    await this.directoryService.deleteDirectory(directoryId);

    return { message: 'Directory was deleted' };
  }
}

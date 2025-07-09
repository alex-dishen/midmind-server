import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { MessageService } from './message.service';
import { AppMessageDto, CreateMessageDto, UpdateMessageDto } from './dto/message.dto';
import { MessageDto } from 'src/shared/dtos/message.dto';
import { ApiPaginatedResponse } from 'src/shared/decorators/api-pagination-response.decorator';
import { PaginatedResult, PaginationDto } from 'src/shared/dtos/pagination.dto';

@ApiTags('Messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class MessageController {
  constructor(private messageService: MessageService) {}

  @ApiOperation({ summary: 'Send a new message' })
  @Post('/chats/:id/messages')
  async createMessage(@Param('id') chatId: string, @Body() data: CreateMessageDto): Promise<MessageDto> {
    return this.messageService.createMessage(chatId, data);
  }

  @ApiOperation({ summary: 'Get chat messages' })
  @ApiPaginatedResponse(MessageDto)
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @Get('/chats/id/messages')
  async getChatMessages(
    @Param('id') chatId: string,
    @Query() pagination: PaginationDto,
  ): Promise<PaginatedResult<AppMessageDto>> {
    return this.messageService.getChatMessages(chatId, pagination);
  }

  @ApiOperation({ summary: 'Edit a message content' })
  @Patch('/messages/:id')
  async editMessageContent(@Param('id') messageId: string, @Body() data: UpdateMessageDto): Promise<MessageDto> {
    return this.messageService.editMessageContent(messageId, data);
  }

  @ApiOperation({ summary: 'Soft delete a message' })
  @Delete('/messages/:id')
  async deleteMessage(@Param('id') messageId: string): Promise<MessageDto> {
    return this.messageService.softDeleteMessage(messageId);
  }
}

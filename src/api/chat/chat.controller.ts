import { ChatService } from './chat.service';
import { MessageDto } from 'src/shared/dtos/message.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { PaginatedResult, PaginationDto } from 'src/shared/dtos/pagination.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ChatDto, CreateChatDto, UpdateChatDto } from 'src/api/chat/dto/chat.dto';
import { ApiPaginatedResponse } from 'src/shared/decorators/api-pagination-response.decorator';
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';

@ApiTags('Chats')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chats')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @ApiOperation({ summary: 'Create a chat' })
  @Post()
  async createChat(@Body() data: CreateChatDto): Promise<ChatDto> {
    return this.chatService.createChat(data);
  }

  @ApiOperation({ summary: 'Get user chats' })
  @ApiPaginatedResponse(ChatDto)
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @Get()
  async getUserChats(@GetUser('sub') userId: string, @Query() pagination: PaginationDto): Promise<PaginatedResult<ChatDto>> {
    return this.chatService.getUserChats(userId, pagination);
  }

  @ApiOperation({ summary: 'Get chat details' })
  @Get('/:id')
  async getChatDetails(@Param('id') chatId: string): Promise<ChatDto> {
    return this.chatService.getChatById(chatId);
  }

  @ApiOperation({ summary: 'Update a chat data' })
  @Put()
  async updateChatData(@Param('id') chatId: string, @Body() data: UpdateChatDto): Promise<MessageDto> {
    return this.chatService.updateChat(chatId, data);
  }

  @ApiOperation({ summary: 'Archive the chat' })
  @Patch()
  async archiveChat(@Param('id') chatId: string): Promise<MessageDto> {
    return this.chatService.archiveChat(chatId);
  }

  @ApiOperation({ summary: 'Delete the chat' })
  @Delete()
  async deleteChat(@Param('id') chatId: string): Promise<MessageDto> {
    return this.chatService.deleteChat(chatId);
  }
}

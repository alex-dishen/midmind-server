import { ChatService } from './chat.service';
import { UpdateChatDto } from './dto/update-chat.dto';
import { MessageDto } from 'src/shared/dtos/message.dto';
import { ChatDto, GetChatQueryDto } from 'src/api/chat/chats/dto/chat.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { ChatDtoMapper } from './mappers/chat.dto.mapper';

@ApiTags('Chats')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chats')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @ApiOperation({ summary: 'Get all user not deleted chats' })
  @Get()
  async getUserChats(@Query() queryParams: GetChatQueryDto, @GetUser('sub') userId: string): Promise<ChatDto[]> {
    const userChats = await this.chatService.getUserNonArchivedChats(userId, queryParams);

    return ChatDtoMapper.toUserChatsDto(userChats);
  }

  @ApiOperation({ summary: 'Update a chat data' })
  @Put('/:id')
  async updateChat(@Param('id') chatId: string, @Body() data: UpdateChatDto): Promise<MessageDto> {
    await this.chatService.updateChat(chatId, data);

    return { message: 'Successfully updated the chat' };
  }

  @ApiOperation({ summary: 'Delete the chat' })
  @Delete('/:id')
  async deleteChat(@Param('id') chatId: string): Promise<MessageDto> {
    await this.chatService.deleteChat(chatId);

    return { message: 'Successfully archived the chat' };
  }
}

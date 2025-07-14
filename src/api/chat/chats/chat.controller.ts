import { ChatService } from './chat.service';
import { MessageDto } from 'src/shared/dtos/message.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChatDto } from 'src/api/chat/chats/dto/chat.dto';
import { Body, Controller, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
import { UpdateChatDto } from './dto/update-chat.dto';

@ApiTags('Chats')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chats')
export class ChatController {
  constructor(private chatService: ChatService) {}

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

  @ApiOperation({ summary: 'Delete the chat' })
  @Delete()
  async deleteChat(@Param('id') chatId: string): Promise<MessageDto> {
    return this.chatService.deleteChat(chatId);
  }
}

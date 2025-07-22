import { ChatService } from './chat.service';
import { plainToInstance } from 'class-transformer';
import { UpdateChatDto } from './dto/update-chat.dto';
import { MessageDto } from 'src/shared/dtos/message.dto';
import { ChatDto } from 'src/api/chat/chats/dto/chat.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';

@ApiTags('Chats')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chats')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @ApiOperation({ summary: 'Create a new chat' })
  @Post()
  async createChat(@GetUser('sub') userId: string): Promise<ChatDto> {
    const createdChat = await this.chatService.createChat(userId);

    return plainToInstance(ChatDto, createdChat);
  }

  @ApiOperation({ summary: 'Get all user chats' })
  @Get()
  async getUserChats(@GetUser('sub') userId: string): Promise<ChatDto[]> {
    const chats = await this.chatService.getUserChats(userId);

    return plainToInstance(ChatDto, chats);
  }

  @ApiOperation({ summary: 'Get chat details' })
  @Get('/:id')
  async getChatDetails(@Param('id') chatId: string): Promise<ChatDto> {
    const chatDetails = await this.chatService.getChatById(chatId);

    return plainToInstance(ChatDto, chatDetails);
  }

  @ApiOperation({ summary: 'Update a chat data' })
  @Put('/:id')
  async updateChatData(@Param('id') chatId: string, @Body() data: UpdateChatDto): Promise<MessageDto> {
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

import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { MessageDto } from 'src/shared/dtos/message.dto';
import { ChatMetadataService } from './chat-meatadata.service';
import { UpdateChatMetadataDto } from './dto/update-chat-meatadata.dto';
import { ChatMetadataByMessageIdDto } from './dto/chat-meatadata-by-message-id.dto';

@ApiTags('Chat Metadata')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class ChatMetadataController {
  constructor(private chatMetadataService: ChatMetadataService) {}

  @ApiOperation({ summary: 'Update a chat metadata by child chat id' })
  @Put('/chats/:id/chat-metadata')
  async updateChatMetadataByChildChatId(
    @Param('id') childChatId: string,
    @Body() data: UpdateChatMetadataDto,
  ): Promise<MessageDto> {
    await this.chatMetadataService.updateChatMetadataByChildChatId(childChatId, data);

    return { message: 'Successfully updated chat metadata' };
  }

  @ApiOperation({ summary: 'Get a chat metadata by message id' })
  @Get('/messages/:id/chat-metadata')
  getChatMetadataByMessage(@Param('id') messageId: string): Promise<ChatMetadataByMessageIdDto[]> {
    return this.chatMetadataService.getChatMetadataByMessageId(messageId);
  }
}

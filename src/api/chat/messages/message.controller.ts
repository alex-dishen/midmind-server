import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { AppMessageDto } from 'src/api/chat/messages/dto/message.dto';
import { MessageService } from 'src/api/chat/messages/message.service';
import { PaginatedResult, PaginationDto } from 'src/shared/dtos/pagination.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiPaginatedResponse } from 'src/shared/decorators/api-pagination-response.decorator';

@ApiTags('Messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class MessageController {
  constructor(private messageService: MessageService) {}
  @ApiOperation({ summary: 'Get chat messages' })
  @ApiPaginatedResponse(AppMessageDto)
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @Get('/chats/:id/messages')
  getChatMessages(@Param('id') chatId: string, @Query() pagination: PaginationDto): Promise<PaginatedResult<AppMessageDto>> {
    return this.messageService.getChatMessages(chatId, pagination);
  }
}

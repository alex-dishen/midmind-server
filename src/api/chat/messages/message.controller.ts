import { MessageDto } from 'src/shared/dtos/message.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { AppMessageDto } from 'src/api/chat/messages/dto/message.dto';
import { MessageService } from 'src/api/chat/messages/message.service';
import { PaginatedResult, PaginationDto } from 'src/shared/dtos/pagination.dto';
import {
  CreateMessageDto,
  CreateMessageResponseCompleteDto,
  CreateMessageResponseContentDto,
  CreateMessageResponseErrorDto,
} from 'src/api/chat/messages/dto/create-message.dto';
import { ApiBearerAuth, ApiExtraModels, ApiOkResponse, ApiOperation, ApiQuery, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ApiPaginatedResponse } from 'src/shared/decorators/api-pagination-response.decorator';
import { Response } from 'express';
import { GetUser } from 'src/shared/decorators/get-user.decorator';

@ApiTags('Messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class MessageController {
  constructor(private messageService: MessageService) {}

  @ApiOperation({ summary: 'Send a new message' })
  @ApiExtraModels(CreateMessageResponseContentDto, CreateMessageResponseCompleteDto, CreateMessageResponseErrorDto)
  @ApiOkResponse({
    schema: {
      oneOf: [
        { $ref: getSchemaPath(CreateMessageResponseContentDto) },
        { $ref: getSchemaPath(CreateMessageResponseCompleteDto) },
        { $ref: getSchemaPath(CreateMessageResponseErrorDto) },
      ],
    },
  })
  @Post('/chats/:id/messages')
  async createMessage(
    @Param('id') chatId: string,
    @Body() data: CreateMessageDto,
    @GetUser('sub') userId: string,
    @Res() res: Response,
  ) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    await this.messageService.createMessage({
      chatId,
      userId,
      data,
      onChunk(chunk) {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      },
    });

    res.end();
  }

  @ApiOperation({ summary: 'Get chat messages' })
  @ApiPaginatedResponse(MessageDto)
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @Get('/chats/:id/messages')
  async getChatMessages(
    @Param('id') chatId: string,
    @Query() pagination: PaginationDto,
  ): Promise<PaginatedResult<AppMessageDto>> {
    return this.messageService.getChatMessages(chatId, pagination);
  }
}

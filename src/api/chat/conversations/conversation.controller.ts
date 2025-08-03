import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { ApiBearerAuth, ApiExtraModels, ApiOkResponse, ApiOperation, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import {
  CreateConversationDto,
  CreateConversationResponseCompleteDto,
  CreateConversationResponseContentDto,
  CreateConversationResponseErrorDto,
  CreateConversationResponseTitleDto,
} from './dto/create-conversation.dto';
import { ConversationService } from './conversation.service';

@ApiTags('Conversations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ConversationController {
  constructor(private conversationService: ConversationService) {}

  @ApiOperation({ summary: 'Initiate a new conversation' })
  @ApiExtraModels(
    CreateConversationResponseTitleDto,
    CreateConversationResponseContentDto,
    CreateConversationResponseCompleteDto,
    CreateConversationResponseErrorDto,
  )
  @ApiOkResponse({
    schema: {
      oneOf: [
        { $ref: getSchemaPath(CreateConversationResponseTitleDto) },
        { $ref: getSchemaPath(CreateConversationResponseErrorDto) },
        { $ref: getSchemaPath(CreateConversationResponseContentDto) },
        { $ref: getSchemaPath(CreateConversationResponseCompleteDto) },
      ],
    },
  })
  @Post()
  async initiateConversation(@Body() data: CreateConversationDto, @GetUser('sub') userId: string, @Res() res: Response) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    await this.conversationService.askAi({
      userId,
      data,
      onChunk(chunk) {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      },
    });

    res.end();
  }
}

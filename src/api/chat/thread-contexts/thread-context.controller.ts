import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ThreadContextService } from './thread-context.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { ThreadContextByMessageIdDto } from './dto/thread-context-by-message-id.dto';

@ApiTags('Thread Contexts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class ThreadContextController {
  constructor(private threadContextService: ThreadContextService) {}

  @ApiOperation({ summary: 'Get thread context by message id' })
  @Get('/messages/:id/thread-context')
  getThreadContextByMessage(@Param('id') messageId: string): Promise<ThreadContextByMessageIdDto> {
    return this.threadContextService.getThreadContextByMessageId(messageId);
  }
}

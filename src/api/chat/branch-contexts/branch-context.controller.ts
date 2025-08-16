import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { BranchContextService } from './branch-context.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { BranchContextByMessageIdDto } from './dto/branch-context-by-message-id.dto';
import { UpdateBranchContextDto } from './dto/update-branch-context.dto';
import { MessageDto } from 'src/shared/dtos/message.dto';

@ApiTags('Branch Contexts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class BranchContextController {
  constructor(private branchContextService: BranchContextService) {}

  @ApiOperation({ summary: 'Update a branch context by child chat id' })
  @Put('/chats/:id/branch-context')
  async updateBranchContextByChildChatId(
    @Param('id') childChatId: string,
    @Body() data: UpdateBranchContextDto,
  ): Promise<MessageDto> {
    await this.branchContextService.updateBranchContextByChildChatId(childChatId, data);

    return { message: 'Successfully updated branch context' };
  }

  @ApiOperation({ summary: 'Get a branch context by message id' })
  @Get('/messages/:id/branch-context')
  getBranchContextByMessage(@Param('id') messageId: string): Promise<BranchContextByMessageIdDto[]> {
    return this.branchContextService.getBranchContextByMessageId(messageId);
  }
}

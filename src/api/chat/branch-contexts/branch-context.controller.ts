import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { BranchContextService } from './branch-context.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { BranchContextByMessageIdDto } from './dto/branch-context-by-message-id.dto';

@ApiTags('Branch Contexts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class BranchContextController {
  constructor(private branchContextService: BranchContextService) {}

  @ApiOperation({ summary: 'Get a branch context by message id' })
  @Get('/messages/:id/branch-context')
  getBranchContextByMessage(@Param('id') messageId: string): Promise<BranchContextByMessageIdDto[]> {
    return this.branchContextService.getBranchContextByMessageId(messageId);
  }
}

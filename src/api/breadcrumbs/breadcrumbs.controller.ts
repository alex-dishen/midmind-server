import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { BreadcrumbsService } from './breadcrumbs.service';
import { ChatBreadcrumbsDto } from './dto/chat-breadcrumbs.dto';
import { BreadcrumbsDtoMapper } from './mappers/breadcrumbs.dto.mapper';

@ApiTags('Breadcrumbs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class BreadcrumbsController {
  constructor(private breadCrumbsService: BreadcrumbsService) {}

  @ApiOperation({ summary: 'Get breadcrumbs for a chat' })
  @Get('/chats/:id/breadcrumbs')
  async getBreadcrumbsForChat(@Param('id') chatId: string): Promise<ChatBreadcrumbsDto[]> {
    const data = await this.breadCrumbsService.getChatBreadcrumbs(chatId);

    return BreadcrumbsDtoMapper.toChatBreadcrumbs(data);
  }
}

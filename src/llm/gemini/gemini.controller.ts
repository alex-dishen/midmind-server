import { Response } from 'express';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Post, Body, Res, UseGuards } from '@nestjs/common';
import { GeminiService } from 'src/llm/gemini/gemini.service';
import { GeminiRequestDto } from 'src/llm/gemini/dto/gemini-request.dto';
import { GeminiStreamChunkDto } from 'src/llm/gemini/dto/gemini-response.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';

@ApiTags('LLM providers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('/chat')
  @ApiResponse({ status: 200, type: GeminiStreamChunkDto })
  async chat(@Body() data: GeminiRequestDto, @Res() res: Response) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });

    const response = await this.geminiService.generateResponse(data);

    for await (const chunk of response) {
      res.write(`data: ${JSON.stringify({ content: chunk.text })}\n\n`);
    }

    res.end();
  }
}

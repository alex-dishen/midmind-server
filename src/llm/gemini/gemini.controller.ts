import { GeminiService } from './gemini.service';
import { Controller, Post, Body } from '@nestjs/common';
import { MessageDto } from 'src/shared/dtos/message.dto';
import { GeminiRequestDto } from 'src/llm/gemini/dto/geimi-request.dto';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('/chat')
  async chat(@Body() data: GeminiRequestDto): Promise<MessageDto> {
    const response = await this.geminiService.generateResponse(data);

    return { message: response.text || "Gemini didn't give any response" };
  }
}

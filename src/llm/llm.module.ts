import { Module } from '@nestjs/common';
import { GeminiService } from 'src/llm/gemini/gemini.service';
import { GeminiController } from 'src/llm/gemini/gemini.controller';

@Module({
  controllers: [GeminiController],
  providers: [GeminiService],
  exports: [GeminiService],
})
export class LLMModule {}

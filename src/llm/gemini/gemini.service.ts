import { GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';
import { GeminiRequestDto } from 'src/llm/gemini/dto/gemini-request.dto';

@Injectable()
export class GeminiService {
  private gemini: GoogleGenAI;

  constructor() {
    // The client gets the API key from the environment variable `GEMINI_API_KEY`.
    this.gemini = new GoogleGenAI({});
  }

  async generateResponse(data: GeminiRequestDto) {
    try {
      const response = await this.gemini.models.generateContentStream({ model: data.model, contents: data.message });

      return response;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

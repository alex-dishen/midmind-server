import { GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';
import { GeminiRequestDto } from 'src/llm/gemini/dto/geimi-request.dto';

@Injectable()
export class GeminiService {
  private gemini: GoogleGenAI;

  constructor() {
    // The client gets the API key from the environment variable `GEMINI_API_KEY`.
    this.gemini = new GoogleGenAI({});
  }

  async generateResponse(data: GeminiRequestDto) {
    try {
      return this.gemini.models.generateContent({ model: data.model, contents: data.message });
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

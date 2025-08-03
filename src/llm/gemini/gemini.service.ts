import { GenerateContentParameters, GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GeminiService {
  private gemini: GoogleGenAI;

  constructor() {
    // The client gets the API key from the environment variable `GEMINI_API_KEY`.
    this.gemini = new GoogleGenAI({});
  }

  async askGeminiWithStream(data: GenerateContentParameters) {
    try {
      const response = await this.gemini.models.generateContentStream({ model: data.model, contents: data.contents });

      return response;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async askGemini(data: GenerateContentParameters) {
    try {
      const response = await this.gemini.models.generateContent({ model: data.model, contents: data.contents });

      return response;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

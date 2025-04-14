declare module '@google/generative-ai' {
  export class GoogleGenerativeAI {
    constructor(apiKey: string);
    getGenerativeModel(config: { model: string }): GenerativeModel;
  }

  export interface GenerativeModel {
    startChat(config: {
      history: Array<{
        role: 'user' | 'model';
        parts: string[];
      }>;
    }): ChatSession;
  }

  export interface ChatSession {
    sendMessage(message: string): Promise<{
      response: {
        text(): string;
      };
    }>;
  }
} 
import 'egg';

declare module 'egg' {
  interface EggAppConfig {
    ollama: {
      baseURL: string;
      embeddingModel: string;
      chatModel: string;
    };
    chromadb: {
      host: string;
      collection: string;
    };
    rag: {
      topK: number;
      scoreThreshold: number;
      systemPrompt: string;
    };
  }
}

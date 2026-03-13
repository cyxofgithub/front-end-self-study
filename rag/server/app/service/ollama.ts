import { Service } from 'egg';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface EmbeddingResponse {
  embedding: number[];
}

export default class OllamaService extends Service {
  private get baseURL(): string {
    return this.config.ollama.baseURL;
  }

  private get embeddingModel(): string {
    return this.config.ollama.embeddingModel;
  }

  private get chatModel(): string {
    return this.config.ollama.chatModel;
  }

  async embed(text: string): Promise<number[]> {
    const resp = await fetch(`${this.baseURL}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.embeddingModel,
        prompt: text,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error(`Ollama embedding failed (${resp.status}): ${errText}`);
    }

    const data = (await resp.json()) as EmbeddingResponse;
    return data.embedding;
  }

  async chatStream(messages: ChatMessage[]): Promise<ReadableStream<Uint8Array>> {
    const resp = await fetch(`${this.baseURL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.chatModel,
        messages,
        stream: true,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error(`Ollama chat failed (${resp.status}): ${errText}`);
    }

    if (!resp.body) {
      throw new Error('Ollama returned no response body');
    }

    return resp.body as ReadableStream<Uint8Array>;
  }
}

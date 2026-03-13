import { Service } from 'egg';

interface RagResult {
  stream: ReadableStream<Uint8Array>;
  sources: Array<{
    filePath: string;
    title: string;
    heading: string;
    excerpt: string;
  }>;
}

export default class RagService extends Service {
  async query(question: string): Promise<RagResult> {
    const { ctx, config } = this;
    const { topK, scoreThreshold, systemPrompt } = config.rag;

    ctx.logger.info(`RAG query: "${question}"`);

    // 1. Embed the question
    const questionEmbedding = await ctx.service.ollama.embed(question);

    // 2. Search ChromaDB for relevant chunks
    const results = await ctx.service.vectorStore.search(questionEmbedding, topK);

    // 3. Filter by score threshold (ChromaDB returns distances, lower = more similar)
    const relevant = results
      .filter(r => r.distance < (1 - scoreThreshold));

    ctx.logger.info(`Found ${relevant.length} relevant chunks (of ${results.length} total)`);

    // 4. Build sources list
    const sources = relevant.map(r => ({
      filePath: r.metadata.filePath,
      title: r.metadata.title,
      heading: r.metadata.heading,
      excerpt: r.document.slice(0, 150) + (r.document.length > 150 ? '...' : ''),
    }));

    // Deduplicate sources by filePath
    const uniqueSources = Array.from(
      new Map(sources.map(s => [s.filePath, s])).values()
    );

    // 5. Build context from retrieved documents
    let context = '';
    if (relevant.length > 0) {
      context = relevant
        .map((r, i) => `[参考文档 ${i + 1}] (${r.metadata.title} - ${r.metadata.heading})\n${r.document}`)
        .join('\n\n---\n\n');
    }

    // 6. Build messages for LLM
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
    ];

    if (context) {
      messages.push({
        role: 'system',
        content: `以下是从知识库中检索到的参考文档：\n\n${context}`,
      });
    }

    messages.push({ role: 'user', content: question });

    // 7. Call Ollama for streaming response
    const stream = await ctx.service.ollama.chatStream(messages);

    return { stream, sources: uniqueSources };
  }
}

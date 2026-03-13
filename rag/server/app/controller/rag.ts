import { Controller } from 'egg';

export default class RagController extends Controller {
  async chatStream() {
    const { ctx } = this;
    const { message, conversation_id } = ctx.request.body as {
      message?: string;
      conversation_id?: string;
    };

    if (!message || !message.trim()) {
      ctx.status = 400;
      ctx.body = { error: '缺少 message 参数' };
      return;
    }

    const res = ctx.res;
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    try {
      const { stream, sources } = await ctx.service.rag.query(message.trim());

      // Send sources first
      res.write(`event: sources\ndata: ${JSON.stringify({ sources })}\n\n`);

      const reader = stream.getReader();
      const decoder = new TextDecoder();

      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          try {
            const json = JSON.parse(trimmed);
            if (json.message?.content) {
              res.write(`event: message\ndata: ${JSON.stringify({
                event: 'message',
                answer: json.message.content,
                conversation_id: conversation_id || '',
              })}\n\n`);
            }
            if (json.done) {
              res.write(`event: message_end\ndata: ${JSON.stringify({ event: 'message_end' })}\n\n`);
            }
          } catch {
            // Skip non-JSON lines
          }
        }
      }

      // Process remaining buffer
      if (buffer.trim()) {
        try {
          const json = JSON.parse(buffer.trim());
          if (json.message?.content) {
            res.write(`event: message\ndata: ${JSON.stringify({
              event: 'message',
              answer: json.message.content,
            })}\n\n`);
          }
        } catch {
          // Ignore
        }
      }

      res.write(`event: end\ndata: ${JSON.stringify({ done: true })}\n\n`);
    } catch (err) {
      const error = err as Error;
      ctx.logger.error('RAG chat error:', error);
      res.write(`event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`);
    } finally {
      res.end();
    }
  }

  async health() {
    const { ctx } = this;
    ctx.body = {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}

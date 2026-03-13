import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo): PowerPartial<EggAppConfig> => {
  const config = {} as PowerPartial<EggAppConfig>;

  config.keys = appInfo.name + '_rag_2026';

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  };

  config.ollama = {
    baseURL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    embeddingModel: process.env.OLLAMA_EMBEDDING_MODEL || 'nomic-embed-text',
    chatModel: process.env.OLLAMA_CHAT_MODEL || 'qwen2.5',
  };

  config.chromadb = {
    host: process.env.CHROMA_HOST || 'http://localhost:8000',
    collection: process.env.CHROMA_COLLECTION || 'frontend-docs',
  };

  config.rag = {
    topK: Number(process.env.RAG_TOP_K) || 5,
    scoreThreshold: Number(process.env.RAG_SCORE_THRESHOLD) || 0.3,
    systemPrompt: `你是一个前端学习笔记知识库助手。请根据提供的参考文档内容来回答用户的问题。
规则：
1. 只根据提供的参考文档来回答，不要编造信息
2. 如果参考文档中没有相关内容，请诚实地说"我在知识库中没有找到相关信息"
3. 回答时使用 Markdown 格式，代码块使用对应语言标记
4. 回答要简洁准确，必要时引用原文`,
  };

  return config;
};

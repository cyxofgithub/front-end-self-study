import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.post('/api/rag/chat/stream', controller.rag.chatStream);
  router.get('/api/rag/health', controller.rag.health);
};

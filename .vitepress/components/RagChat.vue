<script setup lang="ts">
import { ref, nextTick, onMounted, watch, computed } from 'vue';
import { useData, withBase } from 'vitepress';

// ============ Types ============

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  timestamp: number;
}

interface Source {
  filePath: string;
  title: string;
  heading: string;
  excerpt: string;
}

interface SSEData {
  event?: string;
  answer?: string;
  sources?: Source[];
  error?: string;
  done?: boolean;
}

// ============ Props ============

const props = withDefaults(defineProps<{
  apiUrl?: string;
  fullscreen?: boolean;
}>(), {
  apiUrl: 'http://localhost:7001',
  fullscreen: false,
});

// ============ State ============

const { isDark } = useData();
const isOpen = ref(props.fullscreen);
const messages = ref<ChatMessage[]>([]);
const inputValue = ref('');
const isStreaming = ref(false);
const currentAnswer = ref('');
const currentSources = ref<Source[]>([]);
const messagesContainer = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);

const canSend = computed(() => inputValue.value.trim() && !isStreaming.value);

// ============ Auto Scroll ============

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
}

watch([messages, currentAnswer], scrollToBottom);

// ============ SSE Stream Chat ============

async function sendMessage() {
  const text = inputValue.value.trim();
  if (!text || isStreaming.value) return;

  messages.value.push({ role: 'user', content: text, timestamp: Date.now() });
  inputValue.value = '';
  isStreaming.value = true;
  currentAnswer.value = '';
  currentSources.value = [];

  try {
    const resp = await fetch(`${props.apiUrl}/api/rag/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }),
    });

    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
    }

    const reader = resp.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let accumulatedAnswer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      let currentEvent = 'message';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('event:')) {
          currentEvent = trimmed.slice(6).trim();
        } else if (trimmed.startsWith('data:')) {
          const dataStr = trimmed.slice(5).trim();
          if (!dataStr) continue;
          try {
            const data: SSEData = JSON.parse(dataStr);

            if (currentEvent === 'sources' && data.sources) {
              currentSources.value = data.sources;
            } else if (currentEvent === 'message' && data.answer) {
              accumulatedAnswer += data.answer;
              currentAnswer.value = accumulatedAnswer;
            } else if (currentEvent === 'error' && data.error) {
              throw new Error(data.error);
            }
          } catch (e) {
            if ((e as Error).message && !(e as SyntaxError).stack?.includes('JSON')) {
              throw e;
            }
          }
          currentEvent = 'message';
        }
      }
    }

    if (accumulatedAnswer) {
      messages.value.push({
        role: 'assistant',
        content: accumulatedAnswer,
        sources: currentSources.value.length > 0 ? [...currentSources.value] : undefined,
        timestamp: Date.now(),
      });
    }
  } catch (err) {
    const error = err as Error;
    messages.value.push({
      role: 'assistant',
      content: `**错误**: ${error.message || '请求失败，请检查后端服务是否启动'}`,
      timestamp: Date.now(),
    });
  } finally {
    isStreaming.value = false;
    currentAnswer.value = '';
    currentSources.value = [];
    nextTick(() => inputRef.value?.focus());
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function toggleChat() {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    nextTick(() => inputRef.value?.focus());
  }
}

function clearHistory() {
  messages.value = [];
}

function getDocLink(filePath: string): string {
  const link = filePath.replace(/\.md$/, '');
  return withBase(`/${link}`);
}

function formatSimpleMarkdown(text: string): string {
  return text
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^## (.+)$/gm, '<h3>$1</h3>')
    .replace(/^# (.+)$/gm, '<h2>$1</h2>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    .replace(/<\/ul>\s*<ul>/g, '')
    .replace(/\n/g, '<br>');
}

onMounted(() => {
  if (props.fullscreen) {
    nextTick(() => inputRef.value?.focus());
  }
});
</script>

<template>
  <!-- Floating Button (hidden in fullscreen mode) -->
  <button
    v-if="!fullscreen && !isOpen"
    class="rag-chat-fab"
    :class="{ dark: isDark }"
    @click="toggleChat"
    title="AI 知识库助手"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  </button>

  <!-- Chat Panel -->
  <div
    v-if="isOpen || fullscreen"
    class="rag-chat-panel"
    :class="{ dark: isDark, fullscreen }"
  >
    <!-- Header -->
    <div class="rag-chat-header">
      <div class="rag-chat-header-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 16v-4"/>
          <path d="M12 8h.01"/>
        </svg>
        <span>AI 知识库助手</span>
      </div>
      <div class="rag-chat-header-actions">
        <button class="rag-chat-header-btn" @click="clearHistory" title="清空对话">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
        <button v-if="!fullscreen" class="rag-chat-header-btn" @click="toggleChat" title="关闭">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Messages -->
    <div ref="messagesContainer" class="rag-chat-messages">
      <!-- Welcome -->
      <div v-if="messages.length === 0" class="rag-chat-welcome">
        <div class="rag-chat-welcome-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            <circle cx="12" cy="10" r="2"/>
            <path d="M12 12v2"/>
          </svg>
        </div>
        <h3>前端知识库助手</h3>
        <p>基于 500+ 篇学习笔记，回答你的前端问题</p>
        <div class="rag-chat-suggestions">
          <button @click="inputValue = 'Vue 和 React 的区别是什么？'; sendMessage()">
            Vue 和 React 的区别？
          </button>
          <button @click="inputValue = 'JavaScript 闭包是什么？'; sendMessage()">
            JavaScript 闭包是什么？
          </button>
          <button @click="inputValue = 'Webpack 的基本配置怎么写？'; sendMessage()">
            Webpack 基本配置？
          </button>
        </div>
      </div>

      <!-- Message List -->
      <template v-for="(msg, idx) in messages" :key="idx">
        <div class="rag-chat-msg" :class="msg.role">
          <div class="rag-chat-msg-avatar">
            {{ msg.role === 'user' ? '你' : 'AI' }}
          </div>
          <div class="rag-chat-msg-body">
            <div class="rag-chat-msg-content" v-html="formatSimpleMarkdown(msg.content)" />
            <!-- Sources -->
            <div v-if="msg.sources && msg.sources.length > 0" class="rag-chat-sources">
              <div class="rag-chat-sources-title">参考文档：</div>
              <a
                v-for="(src, si) in msg.sources"
                :key="si"
                :href="getDocLink(src.filePath)"
                class="rag-chat-source-link"
                target="_blank"
              >
                <span class="rag-chat-source-title">{{ src.title }}</span>
                <span v-if="src.heading !== src.title" class="rag-chat-source-heading">{{ src.heading }}</span>
              </a>
            </div>
          </div>
        </div>
      </template>

      <!-- Streaming Message -->
      <div v-if="isStreaming" class="rag-chat-msg assistant">
        <div class="rag-chat-msg-avatar">AI</div>
        <div class="rag-chat-msg-body">
          <div v-if="currentAnswer" class="rag-chat-msg-content" v-html="formatSimpleMarkdown(currentAnswer)" />
          <div v-else class="rag-chat-typing">
            <span /><span /><span />
          </div>
        </div>
      </div>
    </div>

    <!-- Input -->
    <div class="rag-chat-input-area">
      <input
        ref="inputRef"
        v-model="inputValue"
        type="text"
        class="rag-chat-input"
        placeholder="输入你的问题..."
        :disabled="isStreaming"
        @keydown="handleKeydown"
      />
      <button
        class="rag-chat-send-btn"
        :disabled="!canSend"
        @click="sendMessage"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* ============ Floating Button ============ */
.rag-chat-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 100;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: none;
  background: var(--vp-c-brand-1, #3451b2);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s, box-shadow 0.2s;
}

.rag-chat-fab:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

/* ============ Chat Panel ============ */
.rag-chat-panel {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 101;
  width: 420px;
  height: 600px;
  max-height: calc(100vh - 48px);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--vp-c-bg, #fff);
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.rag-chat-panel.fullscreen {
  position: relative;
  bottom: auto;
  right: auto;
  width: 100%;
  height: calc(100vh - 200px);
  max-height: none;
  border-radius: 12px;
  box-shadow: none;
}

/* ============ Header ============ */
.rag-chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: var(--vp-c-brand-1, #3451b2);
  color: #fff;
  flex-shrink: 0;
}

.rag-chat-header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 15px;
}

.rag-chat-header-actions {
  display: flex;
  gap: 4px;
}

.rag-chat-header-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
}

.rag-chat-header-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

/* ============ Messages ============ */
.rag-chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ============ Welcome ============ */
.rag-chat-welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 32px 16px;
  flex: 1;
}

.rag-chat-welcome-icon {
  color: var(--vp-c-brand-1, #3451b2);
  margin-bottom: 16px;
  opacity: 0.8;
}

.rag-chat-welcome h3 {
  margin: 0 0 8px;
  font-size: 18px;
  color: var(--vp-c-text-1);
}

.rag-chat-welcome p {
  margin: 0 0 20px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.rag-chat-suggestions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 280px;
}

.rag-chat-suggestions button {
  padding: 10px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-size: 13px;
  text-align: left;
  transition: border-color 0.2s, background 0.2s;
}

.rag-chat-suggestions button:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
}

/* ============ Message Bubble ============ */
.rag-chat-msg {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.rag-chat-msg.user {
  flex-direction: row-reverse;
}

.rag-chat-msg-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.rag-chat-msg.user .rag-chat-msg-avatar {
  background: var(--vp-c-brand-1, #3451b2);
  color: #fff;
}

.rag-chat-msg.assistant .rag-chat-msg-avatar {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
}

.rag-chat-msg-body {
  max-width: 80%;
  min-width: 0;
}

.rag-chat-msg-content {
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
  word-break: break-word;
}

.rag-chat-msg.user .rag-chat-msg-content {
  background: var(--vp-c-brand-1, #3451b2);
  color: #fff;
  border-bottom-right-radius: 4px;
}

.rag-chat-msg.assistant .rag-chat-msg-content {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border-bottom-left-radius: 4px;
}

.rag-chat-msg-content :deep(pre) {
  margin: 8px 0;
  padding: 10px;
  border-radius: 8px;
  background: var(--vp-c-bg-alt, #f6f6f7);
  overflow-x: auto;
  font-size: 13px;
}

.rag-chat-msg.assistant .rag-chat-msg-content :deep(pre) {
  background: var(--vp-c-bg, #fff);
}

.rag-chat-msg-content :deep(code) {
  font-family: var(--vp-font-family-mono);
  font-size: 0.9em;
  padding: 2px 5px;
  border-radius: 4px;
  background: var(--vp-c-bg-alt, #f6f6f7);
}

.rag-chat-msg-content :deep(pre code) {
  padding: 0;
  background: none;
}

.rag-chat-msg-content :deep(strong) {
  font-weight: 600;
}

.rag-chat-msg-content :deep(ul) {
  margin: 4px 0;
  padding-left: 20px;
}

.rag-chat-msg-content :deep(li) {
  margin: 2px 0;
}

/* ============ Sources ============ */
.rag-chat-sources {
  margin-top: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  background: var(--vp-c-bg-alt, #f6f6f7);
  border: 1px solid var(--vp-c-divider);
}

.rag-chat-sources-title {
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin-bottom: 6px;
  font-weight: 500;
}

.rag-chat-source-link {
  display: block;
  padding: 4px 0;
  font-size: 13px;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  transition: color 0.2s;
}

.rag-chat-source-link:hover {
  color: var(--vp-c-brand-2);
  text-decoration: underline;
}

.rag-chat-source-heading {
  color: var(--vp-c-text-3);
  font-size: 12px;
  margin-left: 6px;
}

.rag-chat-source-heading::before {
  content: '> ';
}

/* ============ Typing Indicator ============ */
.rag-chat-typing {
  display: flex;
  gap: 4px;
  padding: 12px 14px;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border-bottom-left-radius: 4px;
}

.rag-chat-typing span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--vp-c-text-3);
  animation: rag-typing 1.4s infinite;
}

.rag-chat-typing span:nth-child(2) {
  animation-delay: 0.2s;
}

.rag-chat-typing span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes rag-typing {
  0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
  30% { opacity: 1; transform: scale(1); }
}

/* ============ Input Area ============ */
.rag-chat-input-area {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  flex-shrink: 0;
}

.rag-chat-input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.rag-chat-input:focus {
  border-color: var(--vp-c-brand-1);
}

.rag-chat-input::placeholder {
  color: var(--vp-c-text-3);
}

.rag-chat-send-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 10px;
  background: var(--vp-c-brand-1, #3451b2);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: opacity 0.2s, transform 0.1s;
}

.rag-chat-send-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.rag-chat-send-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.rag-chat-send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ============ Responsive ============ */
@media (max-width: 480px) {
  .rag-chat-panel:not(.fullscreen) {
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    max-height: 100vh;
    border-radius: 0;
  }
}
</style>

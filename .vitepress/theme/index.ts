import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import { h, nextTick, watch } from 'vue';
import { useData } from 'vitepress';
import { createMermaidRenderer } from 'vitepress-mermaid-renderer';
import RagChat from '../components/RagChat.vue';

const theme: Theme = {
  extends: DefaultTheme,
  Layout() {
    const { isDark } = useData();

    const initMermaid = () => {
      createMermaidRenderer({
        theme: isDark.value ? 'dark' : 'forest',
      });
    };

    nextTick(() => initMermaid());

    watch(
      () => isDark.value,
      () => {
        initMermaid();
      },
    );

    return h(DefaultTheme.Layout, null, {
      'layout-bottom': () => h(RagChat),
    });
  },
  enhanceApp({ app }) {
    app.component('RagChat', RagChat);
  },
};

export default theme;

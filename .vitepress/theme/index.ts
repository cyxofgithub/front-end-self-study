import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import { h } from 'vue';
import RagChat from '../components/RagChat.vue';

const theme: Theme = {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'layout-bottom': () => h(RagChat),
    });
  },
  enhanceApp({ app }) {
    app.component('RagChat', RagChat);
  },
};

export default theme;

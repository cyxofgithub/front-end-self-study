import { createApp, reactive } from "../src";

const App = {
  template: `<div>
    <h1>Min Vue3 Runtime + Compiler</h1>
    <p>count: {{count}}</p>
    <p>title: {{title}}</p>
  </div>`,
  setup() {
    const state = reactive({
      count: 0,
      title: "hello-min-vue"
    });

    setInterval(() => {
      state.count += 1;
    }, 1000);

    return state;
  }
};

createApp(App).mount(document.querySelector("#app") as Element);

## vuex 为什么要区分 mutation 和 action

mutation 负责状态修改，而 action 负责业务逻辑的处理。

这种分离使得代码更加清晰和可维护，对于组件而言只需要关心触发 action，而不需要处理复杂的逻辑。

同时可以方便跟踪状态的变化，因为只能通过 mutation 同步修改状态，可以在 mutation 后记录其变化。

使用示例：

```javascript
// store.js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        count: 0,
    },
    mutations: {
        increment(state) {
            state.count++;
        },
        setCount(state, payload) {
            state.count = payload;
        },
    },
    actions: {
        incrementAsync({ commit }) {
            setTimeout(() => {
                commit('increment');
            }, 1000);
        },
        setCountAsync({ commit }, payload) {
            setTimeout(() => {
                commit('setCount', payload);
            }, 1000);
        },
    },
});
```

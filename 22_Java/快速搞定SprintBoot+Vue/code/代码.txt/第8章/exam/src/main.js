import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';


import router from './router';
import axios from 'axios';
import * as echarts from 'echarts';

import Cookies from 'js-cookie';


import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
const app = createApp(App);

app.use(ElementPlus, {
  locale: zhCn,
})
// 使用 Element Plus
app.use(ElementPlus);

axios.defaults.baseURL = 'http://localhost:8081/';
// sa-token需要通过cookie传递token数据，后端跨域同样需要设置.allowCredentials(true);
axios.defaults.withCredentials = true;

app.config.globalProperties.$echarts = echarts; // 设置 ECharts

// 使用 Vue Router
app.use(router);


app.mount('#app');

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

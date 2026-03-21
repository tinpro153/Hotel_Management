import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import { createPinia } from 'pinia'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

createApp(App).use(router).use(createPinia()).use(Antd).mount('#app')
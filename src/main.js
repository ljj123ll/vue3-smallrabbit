import '@/styles/common.scss'

import { createApp } from 'vue'
import pinia from '@/stores/index.js'
import App from './App.vue'
import router from './router'
// 导入懒加载自定义指令
import { lazyPlugin } from './directives/lazyPlugin'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')

// 注册自定义指令
app.use(lazyPlugin)

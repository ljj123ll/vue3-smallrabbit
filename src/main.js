import '@/styles/common.scss'

import { createApp } from 'vue'
import pinia from '@/stores/index.js'
import App from './App.vue'
import router from './router'
// 还有一个自定义指令没有导入
import { lazyPlugin } from './directives/lazyPlugin'


const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')

// 注册自定义指令
app.use(lazyPlugin)
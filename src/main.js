import '@/styles/common.scss'

import { createApp } from 'vue'
import pinia from '@/stores/index.js'
import App from './App.vue'
import router from './router'
// 导入懒加载自定义指令
import { lazyPlugin } from './directives/lazyPlugin'

const app = createApp(App)

// 在挂载应用前注册所有插件和指令
app.use(pinia)
app.use(router)
app.use(lazyPlugin)

app.mount('#app')

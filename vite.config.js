import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
// element plus解析器和按需加载
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'

// https://vite.dev/config/
export default defineConfig({
  // 配置插件
  plugins: [
    vue(),
    VueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    // 自动导入element plus组件
    Components({
      resolvers: [ElementPlusResolver({ importStyle: 'sass' })]
    }),
    ElementPlus({
      useSource: true
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // element主题定制的入口
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
        // 自动向所有scss文件注入内容
        additionalData: `
        @use "@/styles/element/index.scss" as *;
        @use "@/styles/var.scss" as *;
        `
      }
    }
  },
  server: {
    port: 5191
    // 强制用5191，如果被占用会报错（需先关闭占用程序）
    // 或自动尝试端口时，指定起始端口：
    // port: 5191,
    // strictPort: false, // 占用时自动递增（默认就是false）
  }
})

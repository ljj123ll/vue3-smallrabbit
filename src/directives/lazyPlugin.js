// 导入工具函数（封装了浏览器原生的API），用于监听元素是否进入或离开可视化窗口
import { useIntersectionObserver } from '@vueuse/core'
// 自定义懒加载指令
// 导出了一个名为lazyPlugin的对象，是一个vue的插件，注册到vue应用中就可以全局使用

export const lazyPlugin = {
    // install方法，vue规定的插件注册入口
    install(app){
        // 懒加载逻辑：
        // 注册一个自定义指令使用：（v-img-lazy）,第二个参数是一个定义指令的钩子函数
        app.directive('img-lazy',{
            // 指令的钩子函数支益，令绑定的DOM元素被挂载在页面上的时候触发
            // 两个参数 el:指令绑定的DOM元素(img) binding：包含指令相关信息的对象（这里特指v-img-lazy="url"）
            mounted(el,binding) {
                const { stop } = useIntersectionObserver(el,([{ isIntersecting }]) => {
                    // 解构isIntersecting获取元素是否进入视口的状态，true进入
                    if(isIntersecting) {
                        el.src = binding.value
                        stop()
                    }
                })
            }
        })
    }
}

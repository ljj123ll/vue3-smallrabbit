// 懒加载是一种资源优化加载技术，核心思想是延迟加载非关键资源（图片和视频等大容量资源），仅当资源即将进入用户的可视区域时，
// 才进行架子啊，从而减少初始页面加载的资源体积，提升加载速度和用户体验
// 实现原理：使用浏览器原生的IntersectionObserver API：
// 异步监听目标元素于视口的交叉状态，当元素进入视口时触发回调，此时再加载资源


// 导入工具函数（封装了浏览器原生的API），用于监听元素是否进入或离开可视化窗口
import { useIntersectionObserver } from '@vueuse/core'
// 自定义懒加载指令
// 导出了一个名为lazyPlugin的对象，是一个vue的插件，注册到vue应用中就可以全局使用

export const lazyPlugin = {
    // install方法，vue规定的插件注册入口
    install(app){
        // 懒加载逻辑：
        // 通过app.directive注册一个自定义指令使用：（v-img-lazy）,
        // 第一个参数（el）：要监听的目标元素（img标签）
        // 第二个参数（回调函数）：是一个定义指令的钩子函数:
        // 当指令绑定的DOM元素被挂载到页面上时触发，此时开始监听元素是否进入视口
        // 返回值stop：一个函数，调用后会停止监听（避免后续重复触发）
        app.directive('img-lazy',{
            // 指令的钩子函数支益，令绑定的DOM元素被挂载在页面上的时候触发
            // 两个参数 el:指令绑定的DOM元素(img)
            //  binding：包含指令相关信息的对象（这里特指v-img-lazy="url"）
            mounted(el,binding) {
                const { stop } = useIntersectionObserver(el,([{ isIntersecting }]) => {
                    // 解构isIntersecting获取元素是否进入视口的状态，true进入
                    if(isIntersecting) {
                        // 把指令绑定的值（图片URL）赋值给img的src属性，从而触发图片的加载
                        el.src = binding.value
                        // 加载完成后停止监听
                        stop()
                    }
                })
            }
        })
    }
}

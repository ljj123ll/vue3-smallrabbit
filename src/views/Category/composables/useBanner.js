// vue3组合式函数的本质是抽离复用组件中重复的业务逻辑（如数据请求，响应式状态管理，路由监听等）
// 让组件代码更加的简洁和可维护
// 导入依赖.获取轮播图数据的api，创建响应式变量的ref和挂在钩子函数onMounted
import { getBannerAPI } from '@/apis/category'
import { ref, onMounted } from 'vue'

// 定义组合式函数useBanner
export const useBanner = () => {
  // 创建响应式变量存储轮播图的数据
  const bannerList = ref([])

  // 定义异步函数：获取轮播图的数据
  const getBanner = async () => {
    // 调用后端接口：getBannerAPI
    // 接收的参数{distributionSite: '2'} 业务参数，表示轮播图展示的位置（2.分类，1.首页）
    const res = await getBannerAPI({ distributionSite: '2' })

    // 从后端返回的值res.result是一个数组，将其赋值给bannerList
    bannerList.value = res.result
  }

  // 生命周期钩子函数：组件挂载之后自动请求数据
  onMounted(() => getBanner())
  // 返回响应式变量bannerList，当组件导入useBanner.js的时候，可以直接解构出bannerList
  return {
    bannerList
  }
}

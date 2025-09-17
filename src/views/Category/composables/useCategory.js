// 封装了分类数据获取和路由参数变换时自动更新数据的逻辑
// 在分类相关的组件中，通过调用该函数，可快速获取当前分类的详情数据，并且在路由参数（如ID）
// 变换的时候自动重新请求数据，实现数据与路由的联动

import { getTopCategoryAPI } from '@/apis/category'
// 导入vue-router路由工具：useRouter获取当前路由信息，
// onBeforeRouteUpdate监听路由参数变化，路由更新之前的钩子函数
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
// 导入vue响应式工具：ref创建响应式数据，onMounted组件挂载后钩子
import { ref, onMounted } from 'vue'

// 定义组合函数，封装数据相关的逻辑，用于给组件导入使用
export const useCategory = () => {
  // 定义响应式变量categoryData，用于存储分类详情数据
  const categoryData = ref({})
  // 获取当前路由实例：用于获取路由参数（分类id）
  const route = useRoute()
  // 定义异步函数请求数据
  // 参数id：默认值为当前路由的params.id
  const getCategoryData = async (id = route.params.id) => {
    // 调用API函数，传入id请求分类数据
    const res = await getTopCategoryAPI(id)
    // 把接口返回的结果（res.result）赋值给categoryData.value
    categoryData.value = res.result
  }
  // 组件挂载的时候，调用getCategoryData，来获取数据
  onMounted(() => getCategoryData())

  // 监听路由参数，在更新前触发，分类切换，路由id变化的时候
  onBeforeRouteUpdate(to => {
    // 调用getCategoryData函数，传入新的路由参数id，来更新数据
    getCategoryData(to.params.id)
  })

  return {
    categoryData
  }
}

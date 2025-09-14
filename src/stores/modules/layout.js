// 导入ref函数和defineStore函数，导入API用于向后端请求分类数据
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getCategoryAPI } from '@/apis/layout'

// 定义并导出PiniaStore：{第一个参数：唯一标识；第二个参数：setup风格的函数（定义状态和方法）}
export const useCategoryStore = defineStore('category',() => {
    // 定义响应式状态：categoryList用于存储商品的分类数据，初始值为空
    const categoryList = ref([])

    // 定义异步方法（action），getCategory用于获取商品分类数据
    const getCategory = async () => {
        // 调用API函数发起请求：await等待请求完成，res是后端返回的响应式数据
        const res = await getCategoryAPI()
        // 把响应式中的分类数据赋值给categoryList
        categoryList.value = res.result
    }
    return {
        // 暴露分类列表和获取分类数据的方法
        categoryList,
        getCategory
    }
})
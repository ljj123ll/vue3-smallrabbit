import { ref } from 'vue'
import { defineStore } from 'pinia'
import { loginAPI } from '@/apis/user'
import { useCartStore } from './cart'
import { mergeCartAPI } from '@/apis/cart'


// 定义用户状态仓库，存储用户信息
export const useUserStore = defineStore(
    // 第一个参数，仓库唯一id，pinia通过id区分不同的仓库
    'user',
    // 第二个参数，仓库的核心逻辑（状态，方法等，类似于Vue组件的setup函数）
    () => {
        // 调用购物车store
        const cartStore = useCartStore()

        // 定义用户管理的state，ref创建响应式对象，存储用户信息的状态
        const userInfo = ref({})

        // 定义获取数据的action函数
        const getUserInfo = async({ account, password }) => {
            const res = await loginAPI({ account, password })
            userInfo.value = res.result

            // 合并购物车操作
            await mergeCartAPI(
                cartStore.cartList.map((item) => {
                    return {
                        skuId: item.skuId,
                        selected: item.selected,
                        coun: item.count
                    }
                })
            )
            cartStore.updateCartList()
        }
        // 退出时清除用户的信息
        const clearUserInfo = () => {
            userInfo.value = {}
            cartStore.clearCart()
        }
        return {
            getUserInfo,
            userInfo,
            clearUserInfo
        }
    },
    // 第三个参数：仓库配置项，这里开启持久化存储，pinia自动把仓库中的状态保存到本地存储，刷新页面之后状态不会丢失
    {
        persist: true
    }
)
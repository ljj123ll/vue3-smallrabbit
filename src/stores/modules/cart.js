// 先导入依赖
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
// 导入用户状态store，用于判断登录状态
import { useUserStore } from '@/stores'
// 导入购物策划相关的接口
import { addCartListAPI,getCartListAPI,deleteCartListAPI } from '@/apis/cart'


export const useCartStore = defineStore()












































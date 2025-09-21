import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useUserStore } from '@/stores'
import { addCartListAPI, getCartListAPI, deleteCartListAPI } from '@/apis/cart'

export const useCartStore = defineStore('cart', () => {
  const userStore = useUserStore()
  // 1. 初始化：从localStorage读取未登录时的购物车数据（登录状态以服务器为准）
  const cartList = ref(JSON.parse(localStorage.getItem('cartList') || '[]'))

  const isLogin = computed(() => userStore.userInfo.token)

  // 从服务器同步购物车数据
  const updateCartList = async () => {
    const res = await getCartListAPI()
    cartList.value = res.result
  }

  // 2. 监听cartList变化：未登录时持久化到localStorage（深度监听对象数组）
  watch(
    cartList,
    newCartList => {
      if (!isLogin.value) {
        // 仅未登录时存储到本地
        localStorage.setItem('cartList', JSON.stringify(newCartList))
      }
    },
    { deep: true } // 数组内对象属性变化（如count/selected）也需监听
  )

  // 3. 监听登录状态变化：登录后清空本地存储，同步服务器数据；退出登录读取本地
  watch(isLogin, isNowLogin => {
    if (isNowLogin) {
      localStorage.removeItem('cartList') // 登录后以服务器数据为准，清空本地
      updateCartList() // 登录后立即同步服务器数据
    } else {
      // 退出登录，从本地存储恢复数据
      cartList.value = JSON.parse(localStorage.getItem('cartList') || '[]')
    }
  })

  // 添加购物车（原有逻辑不变）
  const addCart = async goods => {
    const { skuId, count } = goods
    if (isLogin.value) {
      await addCartListAPI({ skuId, count })
      updateCartList()
    } else {
      const item = cartList.value.find(item => goods.skuId === item.skuId)
      item ? (item.count += goods.count) : cartList.value.push(goods)
    }
  }

  // 删除购物车（原有逻辑不变）
  const deleteCart = async skuId => {
    if (isLogin.value) {
      await deleteCartListAPI([skuId])
      updateCartList()
    } else {
      const idx = cartList.value.findIndex(item => skuId === item.skuId)
      cartList.value.splice(idx, 1)
    }
  }

  // 改变数量（原有逻辑不变）
  const changeCount = (skuId, count) => {
    const item = cartList.value.find(item => item.skuId === skuId)
    item.count = count
  }

  // 清空购物车（原有逻辑不变，未登录时需同步localStorage）
  const clearCart = () => {
    cartList.value = []
    if (!isLogin.value) {
      localStorage.setItem('cartList', '[]')
    }
  }

  // 单个勾选（原有逻辑不变）
  const singleCheck = (skuId, selected) => {
    const item = cartList.value.find(item => item.skuId === skuId)
    item.selected = selected
  }

  // 4. 修复全选功能：find → forEach（遍历所有商品）
  const allCheck = selected => {
    cartList.value.forEach(item => {
      // 原代码是find，只遍历第一个元素
      item.selected = selected
    })
  }

  // 计算属性（原有逻辑不变）
  const allCount = computed(() => cartList.value.reduce((sum, item) => sum + item.count, 0))
  const allPrice = computed(() =>
    cartList.value.reduce((sum, item) => sum + item.count * item.price, 0)
  )
  const isAll = computed(() => cartList.value.every(item => item.selected))
  const selectedCount = computed(() =>
    cartList.value.filter(item => item.selected).reduce((sum, item) => sum + item.count, 0)
  )
  const selectedPrice = computed(() =>
    cartList.value
      .filter(item => item.selected)
      .reduce((sum, item) => sum + item.count * item.price, 0)
  )

  return {
    addCart,
    cartList,
    deleteCart,
    allCount,
    allPrice,
    singleCheck,
    allCheck,
    isAll,
    selectedCount,
    selectedPrice,
    changeCount,
    clearCart,
    updateCartList
  }
})

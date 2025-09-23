// 先导入依赖
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
// 导入用户状态store，用于判断登录状态
import { useUserStore } from '@/stores'
// 导入购物策划相关的接口
import { addCartListAPI, getCartListAPI, deleteCartListAPI } from '@/apis/cart'

export const useCartStore = defineStore(
  'cart',
  () => {
    // 登录状态判断与数据同步
    // 获取用户store实例
    const userStore = useUserStore()

    // 定义state
    const cartList = ref([])

    // 计算属性：判断是否登录（通过用户store中的token是否存在）
    const isLogin = computed(() => userStore.userInfo.token)

    // 从服务器同步购物车数据（登陆后合并使用）
    const updateCartList = async () => {
      // 调用api中的接口获取购物车列表
      const res = await getCartListAPI()
      // 更新本地购物车数据
      cartList.value = res.result
    }

    // 定义action

    // 添加购物车，goods传入的参数
    const addCart = async goods => {
      // 从商品信息中解构出商品ID和数量
      const { skuId, count } = goods
      // 判断登录状态
      if (isLogin.value) {
        // 调用api添加购物车接口
        await addCartListAPI({ skuId, count })
        // 重新获取购物车列表，更新本地数据
        updateCartList()
      } else {
        // 未登录时，直接操作本地cartList
        const item = cartList.value.find(item => goods.sku === item.sku)
        if (item) {
          // 商品存在时：购物车里面的数量重新加上添加到购物车的数量
          item.count += goods.count
        } else {
          // 不存在时，直接把传入的商品goods，push进入商品列表
          cartList.value.push(goods)
        }
      }
    }

    // 删除购物车中的商品
    const deleteCart = async skuId => {
      // 先判断是在登录状态还是未登录的状态
      if (isLogin.value) {
        // 登录的状态下直接调用api后端接口来删除，然后再同步本地数据
        // 给api中的删除接口deleteCartListAPI传入skuId
        await deleteCartListAPI([skuId])
        updateCartList()
      } else {
        // 未登录的状态下：直接从本地的cartList中删除
        const idx = cartList.value.findIndex(item => skuId === item.skuId)
        // 从数组中删除对应的商品
        cartList.value.splice(idx, 1)
      }
    }

    // 商品数量的修改
    const changeCount = (skuId, count) => {
      // 找到对应的商品，直接修改数量
      const item = cartList.value.find(item => item.skuId === skuId)
      item.count = count
    }

    // 清空购物车
    const clearCart = () => {
      cartList.value = []
    }

    // 勾选状态相关的方法：
    // 单个商品勾选、取消勾选
    const singleCheck = (skuId, selected) => {
      // 找到对应商品，更新selected属性（true，false）
      const item = cartList.value.find(item => item.skuId === skuId)
      item.selected = selected
    }

    // 全选和取消全选
    const allCheck = selected => {
      //  遍历所有商品，统一设置selected状态
      cartList.value.find(item => {
        item.selected = selected
      })
    }

    // 计算属性（派生状态）
    // 购物车商品总数
    const allCount = computed(() => {
      // 累加所有商品的count属性
      return cartList.value.reduce((sum, item) => sum + item.count, 0)
    })

    // 购物车商品总价格
    const allPrice = computed(() => {
      // 累加所有商品的（数量 * 单价）
      return cartList.value.reduce((sum, item) => sum + item.count * item.price, 0)
    })

    // 是否全选
    const isAll = computed(() => {
      // 检查所有商品是否都勾选（every：所有元素满足条件才返回true）
      return cartList.value.every(item => item.selected)
    })

    // 勾选商品的总数
    const selectedCount = computed(() => {
      // 先筛选出勾选的商品，再累加它们的数量
      return cartList.value.filter(item => item.selected).reduce((sum, item) => sum + item.count, 0)
    })

    // 勾选商品的总价
    const selectedPrice = computed(() => {
      return cartList.value
        .filter(item => item.selected)
        .reduce((sum, item) => sum + item.count * item.price, 0)
    })

    return {
      addCart, // 添加商品
      cartList, // 购物车列表
      deleteCart, // 删除商品
      allCount, // 商品总数
      allPrice, // 商品总价
      singleCheck, // 单个勾选
      allCheck, // 全选
      isAll, // 是否全选
      selectedCount, // 勾选商品总数
      selectedPrice, // 勾选商品总价
      changeCount, // 修改数量
      clearCart, // 清空购物车
      updateCartList, // 同步服务器数据
      isLogin // 登录状态
    }
  },
  {
    persist: true
  }
)

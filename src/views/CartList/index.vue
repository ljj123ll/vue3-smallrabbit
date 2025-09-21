<script setup>
  // 先导入购物车状态管理和路由组件
  import { onMounted } from 'vue'
  import { useCartStore } from '@/stores'
  import { RouterLink } from 'vue-router'
  // 创建购物车stores实例，用于访问购物车状态
  const cartStore = useCartStore()

  // 1. 页面挂载时：登录状态下主动同步服务器购物车数据
  onMounted(() => {
    if (cartStore.isLogin) {
      cartStore.updateCartList()
    }
  })

  // 单选操作：当单个商品的选择状态变化时触发
  const handleCheck = (skuId, selected) => {
    cartStore.singleCheck(skuId, selected)
  }

  // 全选操作：当用户点击全选复选框时触发
  const handleAllCheck = selected => {
    cartStore.allCheck(selected)
  }

  // 改变购物车中商品的数量
  const handleChangeCount = (skuId, count) => {
    cartStore.changeCount(skuId, count)
  }
</script>

<template>
  <div class="xtx-cart-page">
    <div class="container m-top-20">
      <div class="cart">
        <table>
          <thead>
            <tr>
              <!-- 选择 ，绑定全选状态，当全选框变化变化的时候，调用handleAllCheck方法-->
              <th width="120">
                <el-checkbox :modelValue="cartStore.isAll" @change="handleAllCheck" />
              </th>
              <th width="400">商品信息</th>
              <th width="400">单价</th>
              <th width="400">数量</th>
              <th width="400">小计</th>
              <th width="400">操作</th>
            </tr>
          </thead>

          <!-- 商品列表 -->
          <tbody>
            <!-- 循环渲染购物车商品，用商品的id作为key -->
            <tr v-for="i in cartStore.cartList" :key="i.id">
              <td>
                <!-- 单个商品的选择框 -->
                <el-checkbox
                  :modelValue="i.selected"
                  @change="selected => handleCheck(i.skuId, selected)"
                />
              </td>
              <!-- 商品信息（图片+名称） -->
              <td>
                <div class="goods">
                  <RouterLink :to="`/detail/${i.id}`">
                    <img
                      :src="typeof i.picture === 'string' ? i.picture : i.picture[0]"
                      alt="i.skuName"
                    />
                  </RouterLink>
                  <div>
                    <p class="name ellipsis">{{ i.name }}</p>
                  </div>
                </div>
              </td>
              <!-- 单价列，tc类表示文本居中 -->
              <td class="tc">
                <p>&yen;{{ i.price }}</p>
              </td>
              <!-- 数量列，tc类表示文本居中 -->
              <td class="tc">
                <el-input-number
                  :min="1"
                  :modelValue="i.count"
                  @input="count => handleChangeCount(i.skuId, count)"
                />
              </td>
              <!-- 小计列，f16表示字体大小，red表示红色，计算小计保留两位小数 -->
              <td class="tc">
                <p class="f16 red">&yen;{{ (i.price * i.count).toFixed(2) }}</p>
              </td>
              <td class="tc">
                <p>
                  <el-popconfirm
                    title="确定删除吗?"
                    confirm-button-text="确认"
                    cancel-button-text="取消"
                    @confirm="cartStore.deleteCart(i.skuId)"
                  >
                    <template #reference>
                      <a href="#">删除</a>
                    </template>
                  </el-popconfirm>
                </p>
              </td>
            </tr>

            <!-- 购物车为空的时候显示的行 -->
            <tr v-if="cartStore.cartList.length === 0">
              <td colspan="6">
                <div class="cart-none">
                  <el-empty description="购物车为空">
                    <el-button type="primary" @click="$router.push('/')">去购物</el-button>
                  </el-empty>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 操作栏（底部的统计和结算区域） -->
      <div class="action">
        <div class="batch">
          共{{ cartStore.allCount }} 件商品，已选择 {{ cartStore.selectedCount }} 件商品，合计：
          <span class="red">￥ {{ cartStore.selectedPrice.toFixed(2) }}</span>
        </div>
        <div class="total">
          <el-button size="large" type="primary" @click="$router.push('/checkout')">
            下单结算
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .xtx-cart-page {
    // 根容器样式
    margin-top: 20px; // 顶部外边距20px

    .cart {
      // 购物车主体样式
      background: #fff; // 白色背景
      color: #666; // 文本颜色

      table {
        // 表格样式
        border-spacing: 0; // 单元格间距0
        border-collapse: collapse; // 合并边框
        line-height: 24px; // 行高24px

        th,
        td {
          // 表头和单元格共用样式
          padding: 10px; // 内边距10px
          border-bottom: 1px solid #f5f5f5; // 底部边框（浅灰色）

          &:first-child {
            // 第一列（选择列）样式
            text-align: left; // 左对齐
            padding-left: 30px; // 左内边距30px
            color: #999; // 文本颜色（灰色）
          }
        }

        th {
          // 表头样式
          font-size: 16px; // 字体大小16px
          font-weight: normal; // 正常字重（非加粗）
          line-height: 50px; // 行高50px
        }
      }
    }

    .cart-none {
      // 空购物车容器样式
      text-align: center; // 文本居中
      padding: 120px 0; // 上下内边距120px，左右0
      background: #fff; // 白色背景

      p {
        // 空状态文本样式
        color: #999; // 灰色
        padding: 20px 0; // 上下内边距20px
      }
    }

    .tc {
      // 文本居中类
      text-align: center; // 文本居中

      a {
        // 链接样式
        color: $xtxColor; // 使用自定义变量（品牌色）
      }

      .xtx-numbox {
        // 数量输入框容器样式（可能对应Element Plus组件的内部类）
        margin: 0 auto; // 水平居中
        width: 120px; // 宽度120px
      }
    }

    .red {
      // 红色文本类（价格相关）
      color: $priceColor; // 使用自定义变量（价格色，通常为红色）
    }

    .green {
      // 绿色文本类（可能未使用）
      color: $xtxColor; // 品牌色（可能为绿色）
    }

    .f16 {
      // 16px字体类
      font-size: 16px; // 字体大小16px
    }

    .goods {
      // 商品信息容器样式
      display: flex; // flex布局（图片和文字横向排列）
      align-items: center; // 垂直居中对齐

      img {
        // 商品图片样式
        width: 100px; // 宽度100px
        height: 100px; // 高度100px
        max-width: none; // 覆盖全局max-width设置
        max-height: none; // 覆盖全局max-height设置
      }

      > div {
        // 商品文字信息容器
        width: 280px; // 宽度280px
        font-size: 16px; // 字体大小16px
        padding-left: 10px; // 左内边距10px

        .attr {
          // 商品属性文本样式（可能未使用）
          font-size: 14px; // 字体大小14px
          color: #999; // 灰色
        }
      }
    }

    .action {
      // 操作栏样式
      display: flex; // flex布局（左右区域横向排列）
      background: #fff; // 白色背景
      margin-top: 20px; // 顶部外边距20px
      height: 80px; // 高度80px
      align-items: center; // 垂直居中
      font-size: 16px; // 字体大小16px
      justify-content: space-between; // 左右两端对齐
      padding: 0 30px; // 左右内边距30px，上下0

      .xtx-checkbox {
        // 复选框样式（可能未使用）
        color: #999; // 灰色
      }

      .batch {
        // 统计信息区域样式
        a {
          // 链接样式（可能未使用）
          margin-left: 20px; // 左外边距20px
        }
      }

      .red {
        // 操作栏中的红色文本（总价）
        font-size: 18px; // 字体大小18px
        margin-right: 20px; // 右外边距20px
        font-weight: bold; // 加粗
      }
    }

    .tit {
      // 标题样式（可能未使用）
      color: #666; // 灰色
      font-size: 16px; // 字体大小16px
      font-weight: normal; // 正常字重
      line-height: 50px; // 行高50px
    }
  }
</style>

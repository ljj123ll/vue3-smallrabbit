<!-- 支付结果回调页面组件 -->
<script setup>
  // 导入获取订单详情的API
  import { getOrderAPI } from '@/apis/order'
  // 导入Vue的响应式引用和生命周期钩子
  import { onMounted, ref } from 'vue'
  // 导入Vue Router的useRoute钩子，用于获取路由参数
  import { useRoute } from 'vue-router'

  // 获取路由实例
  const route = useRoute()
  // 订单信息响应式数据
  const orderInfo = ref({})

  // 获取订单详情的异步函数
  const getOrderInfo = async () => {
    // 调用API获取订单详情，通过路由参数传递订单ID
    const res = await getOrderAPI(route.query.orderId)
    // 更新订单信息
    orderInfo.value = res.result
  }

  // 组件挂载时执行获取订单信息
  onMounted(() => getOrderInfo())
</script>

<template>
  <!-- 支付结果页面容器 -->
  <div class="xtx-pay-page">
    <div class="container">
      <!-- 支付结果展示区域 -->
      <div class="pay-result">
        <!-- 支付成功图标 -->
        <span class="iconfont icon-queren2 green" v-if="route.query.payResult === 'true'"></span>
        <!-- 支付失败图标 -->
        <span class="iconfont icon-shanchu red" v-else></span>
        <!-- 支付结果标题 -->
        <p class="tit">支付{{ $route.query.payResult === 'true' ? '成功' : '失败' }}</p>
        <!-- 支付结果提示信息 -->
        <p class="tip">
          {{
            $route.query.payResult === 'true'
              ? '我们将尽快为您发货，收货期间请保持手机畅通'
              : '请重新支付'
          }}
        </p>
        <!-- 支付方式信息 -->
        <p>
          支付方式：
          <span>支付宝</span>
        </p>
        <!-- 支付金额信息 -->
        <p>
          支付金额：
          <span>¥{{ orderInfo.payMoney?.toFixed(2) }}</span>
        </p>
        <!-- 操作按钮区域 -->
        <div class="btn">
          <!-- 查看订单按钮 -->
          <el-button type="primary" style="margin-right: 20px" @click="$router.push('checkout')">
            查看订单
          </el-button>
          <!-- 返回首页按钮 -->
          <el-button @click="$router.push('/')">进入首页</el-button>
        </div>
        <!-- 安全提示信息 -->
        <p class="alert">
          <span class="iconfont icon-tip"></span>
          温馨提示：小兔鲜儿不会以订单异常、系统升级为由要求您点击任何网址链接进行退款操作，保护资产、谨慎操作。
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  // 支付结果展示区域样式
  .pay-result {
    padding: 100px 0;
    background: #fff;
    text-align: center;
    margin-top: 20px;

    > .iconfont {
      // 结果图标基础样式
      font-size: 100px;
    }

    .green {
      // 支付成功颜色样式
      color: #1dc779;
    }

    .red {
      // 支付失败颜色样式
      color: $priceColor;
    }

    .tit {
      // 标题样式
      font-size: 24px;
    }

    .tip {
      // 提示信息样式
      color: #999;
    }

    p {
      // 文本行高和字体大小
      line-height: 40px;
      font-size: 16px;
    }

    .btn {
      // 按钮容器样式
      margin-top: 50px;
    }

    .alert {
      // 安全提示样式
      font-size: 12px;
      color: #999;
      margin-top: 50px;
    }
  }
</style>

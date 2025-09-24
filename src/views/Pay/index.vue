<!-- 支付页面组件 -->
<script setup>
  // 导入获取订单详情的API
  import { getOrderAPI } from '@/apis/order'
  // 导入Vue Router的useRoute钩子，用于获取路由参数
  import { useRoute } from 'vue-router'
  // 导入Vue的响应式引用和生命周期钩子
  import { ref, onMounted } from 'vue'
  // 导入自定义的倒计时组合式函数
  import { useCountDown } from '@/composables/formatTime'

  // 解构倒计时函数，获取格式化时间和开始倒计时的方法
  const { formatTime, start } = useCountDown()
  // 订单支付信息响应式数据
  const payInfo = ref({})
  // 获取路由实例
  const route = useRoute()

  // 获取订单支付信息的异步函数
  const getPayInfo = async () => {
    // 调用API获取订单详情，通过路由参数传递订单ID
    const res = await getOrderAPI(route.query.id)
    // 更新订单支付信息
    payInfo.value = res.result
    // 初始化倒计时，使用订单中的倒计时数据
    start(res.result.countdown)
  }

  // 组件挂载时执行获取订单信息
  onMounted(() => getPayInfo())

  // 支付相关配置
  // 支付API基础URL
  const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'
  // 支付成功后回调地址
  const backURL = 'http://localhost:5173/paycallback'
  // 对回调地址进行URL编码
  const redirectUrl = encodeURIComponent(backURL)
  // 支付宝支付跳转链接，包含订单ID和回调地址
  const payUrl = `${baseURL}pay/aliPay?orderId=${route.query.id}&redirect=${redirectUrl}`
</script>

<template>
  <!-- 支付页面容器 -->
  <div class="xtx-pay-page">
    <div class="container">
      <!-- 付款信息区域 -->
      <div class="pay-info">
        <span class="icon iconfont icon-queren2"></span>
        <div class="tip">
          <p>订单提交成功！请尽快完成支付。</p>
          <p>
            支付还剩
            <span>{{ formatTime }}</span>
            , 超时后将取消订单
          </p>
        </div>
        <div class="amount">
          <span>应付总额：</span>
          <span>¥{{ payInfo.payMoney?.toFixed(2) }}</span>
        </div>
      </div>
      <!-- 付款方式选择区域 -->
      <div class="pay-type">
        <p class="head">选择以下支付方式付款</p>
        <!-- 支付平台选择 -->
        <div class="item">
          <p>支付平台</p>
          <a class="btn wx" href="javascript:;"></a>
          <!-- 支付宝支付链接，点击后跳转到支付宝支付页面 -->
          <a class="btn alipay" :href="payUrl"></a>
        </div>
        <!-- 银行卡选择 -->
        <div class="item">
          <p>支付方式</p>
          <a class="btn" href="javascript:;">招商银行</a>
          <a class="btn" href="javascript:;">工商银行</a>
          <a class="btn" href="javascript:;">建设银行</a>
          <a class="btn" href="javascript:;">农业银行</a>
          <a class="btn" href="javascript:;">交通银行</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  // 支付页面基础样式
  .xtx-pay-page {
    margin-top: 20px;
  }

  // 付款信息区域样式
  .pay-info {
    background: #fff;
    display: flex;
    align-items: center;
    height: 240px;
    padding: 0 80px;

    .icon {
      // 成功图标样式
      font-size: 80px;
      color: #1dc779;
    }

    .tip {
      // 提示信息样式
      padding-left: 10px;
      flex: 1;

      p {
        &:first-child {
          font-size: 20px;
          margin-bottom: 5px;
        }

        &:last-child {
          color: #999;
          font-size: 16px;
        }
      }
    }

    .amount {
      // 金额信息样式
      span {
        &:first-child {
          font-size: 16px;
          color: #999;
        }

        &:last-child {
          color: $priceColor;
          font-size: 20px;
        }
      }
    }
  }

  // 付款方式选择区域样式
  .pay-type {
    margin-top: 20px;
    background-color: #fff;
    padding-bottom: 70px;

    p {
      // 标题样式
      line-height: 70px;
      height: 70px;
      padding-left: 30px;
      font-size: 16px;

      &.head {
        border-bottom: 1px solid #f5f5f5;
      }
    }

    .btn {
      // 支付按钮基础样式
      width: 150px;
      height: 50px;
      border: 1px solid #e4e4e4;
      text-align: center;
      line-height: 48px;
      margin-left: 30px;
      color: #666666;
      display: inline-block;

      &.active,
      &:hover {
        border-color: $xtxColor;
      }

      &.alipay {
        // 支付宝图标样式
        background: url(https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/7b6b02396368c9314528c0bbd85a2e06.png)
          no-repeat center / contain;
      }

      &.wx {
        // 微信支付图标样式
        background: url(https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/c66f98cff8649bd5ba722c2e8067c6ca.jpg)
          no-repeat center / contain;
      }
    }
  }
</style>

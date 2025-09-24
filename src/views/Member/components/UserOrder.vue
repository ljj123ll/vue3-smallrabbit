<!-- 用户订单列表组件 -->
<script setup>
  // 导入获取用户订单的API
  import { getUserOrderAPI } from '@/apis/order'
  // 导入Vue钩子函数和响应式引用
  import { onMounted, ref } from 'vue'

  // 订单状态标签列表配置
  const tabTypes = [
    { name: 'all', label: '全部订单' },
    { name: 'unpay', label: '待付款' },
    { name: 'deliver', label: '待发货' },
    { name: 'receive', label: '待收货' },
    { name: 'comment', label: '待评价' },
    { name: 'complete', label: '已完成' },
    { name: 'cancel', label: '已取消' }
  ]

  // 创建订单状态格式化函数，将数字状态转换为中文描述
  const fomartPayState = payState => {
    const stateMap = {
      1: '待付款',
      2: '待发货',
      3: '待收货',
      4: '待评价',
      5: '已完成',
      6: '已取消'
    }
    return stateMap[payState]
  }

  // 响应式数据定义
  // 订单列表数据
  const orderList = ref([])
  // 订单总数
  const total = ref(0)
  // 请求参数配置，包括订单状态、页码和每页数量
  const params = ref({
    orderState: 0, // 0表示全部订单
    page: 1, // 当前页码
    pageSize: 2 // 每页显示数量
  })

  // 获取用户订单数据的异步函数
  const getUserOrder = async () => {
    // 调用API获取订单数据
    const res = await getUserOrderAPI(params.value)
    // 更新订单列表数据
    orderList.value = res.result.items
    // 更新订单总数
    total.value = res.result.counts
  }

  // 组件挂载时执行获取订单数据
  onMounted(() => getUserOrder())

  // 订单状态标签切换处理函数
  const tabChange = type => {
    // 更新订单状态参数
    params.value.orderState = type
    // 重新获取订单数据
    getUserOrder()
  }

  // 分页切换处理函数
  const pageChange = page => {
    // 更新页码参数
    params.value.page = page
    // 重新获取订单数据
    getUserOrder()
  }
</script>

<template>
  <!-- 订单列表容器 -->
  <div class="order-container">
    <!-- Element Plus标签页组件，用于切换不同状态的订单 -->
    <el-tabs @tab-change="tabChange">
      <!-- 动态生成订单状态标签 -->
      <el-tab-pane v-for="item in tabTypes" :key="item.name" :label="item.label" />
      <!-- 主内容区域 -->
      <div class="main-container">
        <!-- 无订单数据时显示空状态 -->
        <div class="holder-container" v-if="orderList.length === 0">
          <el-empty description="暂无订单数据" />
        </div>
        <!-- 有订单数据时显示订单列表 -->
        <div v-else>
          <!-- 遍历订单列表 -->
          <div class="order-item" v-for="order in orderList" :key="order.id">
            <!-- 订单头部信息 -->
            <div class="head">
              <span>下单时间：{{ order.createTime }}</span>
              <span>订单编号：{{ order.id }}</span>
              <!-- 未付款订单显示倒计时 -->
              <span class="down-time" v-if="order.orderState === 1">
                <i class="iconfont icon-down-time"></i>
                <b>付款截止: {{ order.countdown }}</b>
              </span>
            </div>
            <!-- 订单主体内容 -->
            <div class="body">
              <!-- 商品信息列 -->
              <div class="column goods">
                <ul>
                  <!-- 遍历订单中的商品列表 -->
                  <li v-for="item in order.skus" :key="item.id">
                    <!-- 商品图片 -->
                    <a class="image" href="javascript:;">
                      <img :src="item.image" alt="" />
                    </a>
                    <!-- 商品信息 -->
                    <div class="info">
                      <p class="name ellipsis-2">
                        {{ item.name }}
                      </p>
                      <p class="attr ellipsis">
                        <span>{{ item.attrsText }}</span>
                      </p>
                    </div>
                    <!-- 商品价格 -->
                    <div class="price">¥{{ item.realPay?.toFixed(2) }}</div>
                    <!-- 商品数量 -->
                    <div class="count">x{{ item.quantity }}</div>
                  </li>
                </ul>
              </div>
              <!-- 订单状态列 -->
              <div class="column state">
                <p>{{ fomartPayState(order.orderState) }}</p>
                <!-- 待收货状态显示查看物流按钮 -->
                <p v-if="order.orderState === 3">
                  <a href="javascript:;" class="green">查看物流</a>
                </p>
                <!-- 待评价状态显示评价商品按钮 -->
                <p v-if="order.orderState === 4">
                  <a href="javascript:;" class="green">评价商品</a>
                </p>
                <!-- 已完成状态显示查看评价按钮 -->
                <p v-if="order.orderState === 5">
                  <a href="javascript:;" class="green">查看评价</a>
                </p>
              </div>
              <!-- 订单金额列 -->
              <div class="column amount">
                <p class="red">¥{{ order.payMoney?.toFixed(2) }}</p>
                <p>（含运费：¥{{ order.postFee?.toFixed(2) }}）</p>
                <p>在线支付</p>
              </div>
              <!-- 操作按钮列 -->
              <div class="column action">
                <!-- 待付款状态显示立即付款按钮 -->
                <el-button v-if="order.orderState === 1" type="primary" size="small">
                  立即付款
                </el-button>
                <!-- 待收货状态显示确认收货按钮 -->
                <el-button v-if="order.orderState === 3" type="primary" size="small">
                  确认收货
                </el-button>
                <!-- 通用查看详情按钮 -->
                <p><a href="javascript:;">查看详情</a></p>
                <!-- 特定状态显示再次购买按钮 -->
                <p v-if="[2, 3, 4, 5].includes(order.orderState)">
                  <a href="javascript:;">再次购买</a>
                </p>
                <!-- 特定状态显示申请售后按钮 -->
                <p v-if="[4, 5].includes(order.orderState)">
                  <a href="javascript:;">申请售后</a>
                </p>
                <!-- 待付款状态显示取消订单按钮 -->
                <p v-if="order.orderState === 1">
                  <a href="javascript:;">取消订单</a>
                </p>
              </div>
            </div>
          </div>
          <!-- 分页组件 -->
          <div class="pagination-container">
            <el-pagination
              :total="total"
              @current-change="pageChange"
              :page-size="params.pageSize"
              background
              layout="prev, pager, next"
            />
          </div>
        </div>
      </div>
    </el-tabs>
  </div>
</template>

<style scoped lang="scss">
  .order-container {
    // 订单容器基础样式
    padding: 10px 20px;

    .pagination-container {
      // 分页组件容器样式
      display: flex;
      justify-content: center;
    }

    .main-container {
      // 主内容区域样式
      min-height: 500px;

      .holder-container {
        // 空状态容器样式
        min-height: 500px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

  .order-item {
    // 单个订单项样式
    margin-bottom: 20px;
    border: 1px solid #f5f5f5;

    .head {
      // 订单头部样式
      height: 50px;
      line-height: 50px;
      background: #f5f5f5;
      padding: 0 20px;
      overflow: hidden;

      span {
        margin-right: 20px;

        &.down-time {
          // 倒计时样式
          margin-right: 0;
          float: right;

          i {
            vertical-align: middle;
            margin-right: 3px;
          }

          b {
            vertical-align: middle;
            font-weight: normal;
          }
        }
      }

      .del {
        margin-right: 0;
        float: right;
        color: #999;
      }
    }

    .body {
      // 订单主体样式
      display: flex;
      align-items: stretch;

      .column {
        // 列基础样式
        border-left: 1px solid #f5f5f5;
        text-align: center;
        padding: 20px;

        > p {
          padding-top: 10px;
        }

        &:first-child {
          border-left: none;
        }

        &.goods {
          // 商品信息列样式
          flex: 1;
          padding: 0;
          align-self: center;

          ul {
            li {
              // 商品列表项样式
              border-bottom: 1px solid #f5f5f5;
              padding: 10px;
              display: flex;

              &:last-child {
                border-bottom: none;
              }

              .image {
                // 商品图片样式
                width: 70px;
                height: 70px;
                border: 1px solid #f5f5f5;
              }

              .info {
                // 商品信息样式
                width: 220px;
                text-align: left;
                padding: 0 10px;

                p {
                  margin-bottom: 5px;

                  &.name {
                    height: 38px;
                  }

                  &.attr {
                    color: #999;
                    font-size: 12px;

                    span {
                      margin-right: 5px;
                    }
                  }
                }
              }

              .price {
                // 商品价格样式
                width: 100px;
              }

              .count {
                // 商品数量样式
                width: 80px;
              }
            }
          }
        }

        &.state {
          // 订单状态列样式
          width: 120px;

          .green {
            color: $xtxColor;
          }
        }

        &.amount {
          // 订单金额列样式
          width: 200px;

          .red {
            color: $priceColor;
          }
        }

        &.action {
          // 操作按钮列样式
          width: 140px;

          a {
            display: block;

            &:hover {
              color: $xtxColor;
            }
          }
        }
      }
    }
  }
</style>

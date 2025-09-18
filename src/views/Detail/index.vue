<script setup>
  // 导入请求商品详情数据的api
  import { getDetailAPI } from '@/apis/detail'
  import { ref } from 'vue'
  import { useRoute } from 'vue-router'
  // 导入自定义规格选择组件
  import GoodsSku from '@/components/GoodsSku.vue'
  // 导入购物车模块的store
  import { useCartStore } from '@/stores/index'
  import { ElMessage } from 'element-plus'

  // 定义响应式数据
  // 存储商品的详情信息
  const good = ref({})
  // 获取当前的路由实例
  const route = useRoute()
  // 存储用户选中的商品规格
  const skuObj = ref({})
  // 存储用户选中的商品数量
  const num = ref(1)
  // 初始化购物车Store实例
  const cartStore = useCartStore()

  const getGoods = async () => {
    const res = await getDetailAPI(route.params.id)
    good.value = res.result
  }
  getGoods()

  //规格选择回调 (接收组件GoodsSku的选中结果)
  const skuChange = sku => {
    skuObj.value = sku
  }
  // 数量选择回调（接收el-input-number的输入结果）
  const countChange = count => {
    num.value = count
  }
  // 加入购物车的核心逻辑
  const add = () => {
    // 判断是否选择了商品的规格(skuObj有skuId表示规格选择已完成)
    if (skuObj.value.skuId) {
      // 调用购物车Store的addCart方法,传入商品信息
      cartStore.addCart({
        id: good.value.id, // 商品ID
        name: good.value.name, // 商品名称
        picture: good.value.mainPictures, // 商品主图（数组格式）
        price: good.value.price, // 商品现价
        count: num.value, // 购买数量
        skuId: skuObj.value.skuId, // 选中的规格ID
        attrsText: skuObj.value.specsText, // 规格文本（如“红色-42码”）
        selected: true // 加入购物车后默认选中
      })
      ElMessage.success('加入购物车成功')
    } else {
      ElMessage.warning('请选择商品规格')
    }
  }
</script>

<template>
  <!-- 跟组件容器 -->
  <div class="xtx-goods-page">
    <!-- 核心内容容器:v-if确保有数据之后再进行渲染 -->
    <div class="container" v-if="good.details">
      <div class="bread-container">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator=">">
          <!-- 四层面包屑导航 -->
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: `/category/${good.categories?.[1].id}` }">
            {{ good.categories?.[1].name }}
          </el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: `/category/sub/${good.categories?.[0].id}` }">
            {{ good.categories?.[0].name }}
          </el-breadcrumb-item>
          <el-breadcrumb-item>{{ good.name }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <!-- 商品核心信心区域(图片+基本信息+规格) -->
      <div class="info-cotainer">
        <!-- 弹性布局容器 -->
        <div class="goods-info">
          <!-- 左侧:图片预览 + 销量统计 -->
          <div class="media">
            <goods-image :imageList="good.mainPictures"></goods-image>
            <!-- 图片下面的销量/评价/收藏/品牌统计 -->
            <ul class="goods-sales">
              <li>
                <p>销量人气</p>
                <p>{{ good.salesCount }}+</p>
                <p>
                  <i class="iconfont icon-task-filling"></i>
                  销量人气
                </p>
              </li>

              <li>
                <p>商品评价</p>
                <p>{{ good.commentCount }}+</p>
                <p>
                  <i class="iconfont icon-comment-filling"></i>
                  商品评价
                </p>
              </li>

              <li>
                <p>收藏人气</p>
                <p>{{ good.collectCount }}+</p>
                <p>
                  <i class="iconfont icon-favorite-filling"></i>
                  收藏人气
                </p>
              </li>

              <li>
                <p>品牌信息</p>
                <p>{{ good.brand.name }}</p>
                <p>
                  <i class="iconfont icon-dynamic-filling"></i>
                  品牌信息
                </p>
              </li>
            </ul>
          </div>

          <!-- 右侧:商品信息+规格选择+加入购物车 -->
          <div class="spec">
            <p class="g-name">{{ good.name }}</p>
            <p class="g-desc">{{ good.desc }}</p>
            <p class="g-price">
              <span>{{ good.oldPrice }}</span>
              <span>{{ good.price }}</span>
            </p>

            <div class="g-service">
              <dl>
                <dt>促销</dt>
                <dd>12月好物放送,APP领卷购买,直降120元</dd>
              </dl>
              <dl>
                <dt>服务保障</dt>
                <dd>
                  <span>无忧退货</span>
                  <span>快速退款</span>
                  <span>免费包邮</span>
                  <a href="#">了解详情</a>
                </dd>
              </dl>
            </div>
            <!-- 自定义规格选择组件:传入商品数据,监听规格变化 -->
            <GoodsSku :goods="good" @change="skuChange"></GoodsSku>
            <el-input-number v-model="num" :min="1" @change="countChange" />
            <!-- 按钮 -->
            <el-button size="large" class="btn" @click="add">加入购物车</el-button>
          </div>
        </div>

        <!-- 底部区域(详情属性+侧边热榜) -->
        <div class="goods-footer">
          <!-- 左侧:商品详情(属性列表) -->
          <div class="goods-article">
            <!-- 商品详情 -->
            <div class="goods-tabs">
              <nav>
                <a href="#">商品详情</a>
              </nav>
              <div class="goods-detail">
                <ul class="attrs">
                  <li v-for="item in good.details.properties" :key="item.value">
                    <span class="dt">{{ item.name }}</span>
                    <span class="dd">{{ item.value }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <!-- 右侧:侧边热榜 -->
          <div class="goods-aside">
            <goods-hot :type="1"></goods-hot>
            <goods-hot :type="2"></goods-hot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  // 页面根容器样式
  .xtx-goods-page {
    // 商品核心信息区布局（弹性布局，左右分栏）
    .goods-info {
      min-height: 600px;
      background: #fff;
      display: flex;

      // 左侧图片+销量区：固定宽度
      .media {
        width: 580px;
        height: 600px;
        padding: 30px 50px;
      }

      // 右侧信息区：占剩余宽度
      .spec {
        flex: 1;
        padding: 30px 30px 30px 0;
      }
    }

    // 商品底部区域布局（左右分栏）
    .goods-footer {
      display: flex;
      margin-top: 20px;

      // 左侧详情区：固定宽度
      .goods-article {
        width: 940px;
        margin-right: 20px;
      }

      // 右侧热榜区：固定宽度
      .goods-aside {
        width: 280px;
        min-height: 1000px;
      }
    }

    // 商品详情页签容器样式
    .goods-tabs {
      min-height: 600px;
      background: #fff;
    }

    // 数量选择器容器样式
    .number-box {
      display: flex;
      align-items: center;

      .label {
        width: 60px;
        color: #999;
        padding-left: 10px;
      }
    }

    // 商品名称样式
    .g-name {
      font-size: 22px;
    }

    // 商品描述样式（灰色）
    .g-desc {
      color: #999;
      margin-top: 10px;
    }

    // 商品价格样式（现价红色、原价划线）
    .g-price {
      margin-top: 10px;

      span {
        // 价格前加“¥”符号（伪元素）
        &::before {
          content: '¥';
          font-size: 14px;
        }

        // 现价样式（红色、大字体）
        &:first-child {
          color: $priceColor;
          margin-right: 10px;
          font-size: 22px;
        }

        // 原价样式（灰色、划线）
        &:last-child {
          color: #999;
          text-decoration: line-through;
          font-size: 16px;
        }
      }
    }

    // 促销与服务区域样式（灰色背景）
    .g-service {
      background: #f5f5f5;
      width: 500px;
      padding: 20px 10px 0 10px;
      margin-top: 10px;

      dl {
        padding-bottom: 20px;
        display: flex;
        align-items: center;

        // 标签样式（灰色、固定宽度）
        dt {
          width: 50px;
          color: #999;
        }

        // 内容样式
        dd {
          color: #666;

          // 服务项样式（每项前加“•”）
          &:last-child {
            span {
              margin-right: 10px;

              &::before {
                content: '•';
                color: $xtxColor;
                margin-right: 2px;
              }
            }

            // 链接样式（品牌色）
            a {
              color: $xtxColor;
            }
          }
        }
      }
    }

    // 销量/评价/收藏/品牌统计样式（横向排列，带分隔线）
    .goods-sales {
      display: flex;
      width: 400px;
      align-items: center;
      text-align: center;
      height: 140px;

      li {
        flex: 1; // 四等分
        position: relative;

        // 分隔线：给除第一个li外的li加左侧竖线（伪元素）
        ~ li::after {
          position: absolute;
          top: 10px;
          left: 0;
          height: 60px;
          border-left: 1px solid #e4e4e4;
          content: '';
        }

        p {
          // 第一行文本（灰色，如“销量人气”）
          &:first-child {
            color: #999;
          }

          // 第二行文本（价格色，如销量数字）
          &:nth-child(2) {
            color: $priceColor;
            margin-top: 10px;
          }

          // 第三行文本（带图标，hover变品牌色）
          &:last-child {
            color: #666;
            margin-top: 10px;

            i {
              color: $xtxColor;
              font-size: 14px;
              margin-right: 2px;
            }

            &:hover {
              color: $xtxColor;
              cursor: pointer;
            }
          }
        }
      }
    }
  }

  // 商品详情页签样式（独立作用域，因scoped不影响子组件）
  .goods-tabs {
    min-height: 600px;
    background: #fff;

    nav {
      height: 70px;
      line-height: 70px;
      display: flex;
      border-bottom: 1px solid #f5f5f5; // 底部边框线

      a {
        padding: 0 40px;
        font-size: 18px;
        position: relative;

        > span {
          color: $priceColor;
          font-size: 16px;
          margin-left: 10px;
        }
      }
    }
  }

  // 商品详情内容区样式
  .goods-detail {
    padding: 40px;

    // 属性列表样式（两列布局）
    .attrs {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 30px;

      li {
        display: flex;
        margin-bottom: 10px;
        width: 50%; // 每列占50%（两列）

        // 属性名称（灰色、固定宽度）
        .dt {
          width: 100px;
          color: #999;
        }

        // 属性值（深色）
        .dd {
          flex: 1;
          color: #666;
        }
      }
    }

    // 详情图片样式（全屏宽度）
    > img {
      width: 100%;
    }
  }

  // 加入购物车按钮样式（顶部间距）
  .btn {
    margin-top: 20px;
  }

  // 面包屑容器样式（上下间距）
  .bread-container {
    padding: 25px 0;
  }
</style>

<script setup>
  // 导入请求商品详情数据的api
  import { getDetailAPI } from '@/apis/detail'
  import { ref, watch, onBeforeMount } from 'vue'
  import { useRoute } from 'vue-router'
  // 导入自定义规格选择组件
  import GoodsSku from '@/components/GoodsSku.vue'
  // 导入购物车模块的store
  import { useCartStore } from '@/stores/index'
  import { ElMessage, ElSkeleton, ElIcon } from 'element-plus'
  import { Loading } from '@element-plus/icons-vue'

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
  // 加载状态
  const loading = ref(false)
  // 缓存key前缀
  const CACHE_PREFIX = 'goods_detail_'

  // 从缓存获取数据
  const getFromCache = id => {
    try {
      const cached = sessionStorage.getItem(CACHE_PREFIX + id)
      if (cached) {
        const data = JSON.parse(cached)
        // 检查缓存是否过期（5分钟）
        if (Date.now() - data.timestamp < 5 * 60 * 1000) {
          return data.data
        }
      }
    } catch (e) {
      console.error('获取缓存数据失败:', e)
    }
    return null
  }

  // 保存数据到缓存
  const saveToCache = (id, data) => {
    try {
      sessionStorage.setItem(
        CACHE_PREFIX + id,
        JSON.stringify({
          data,
          timestamp: Date.now()
        })
      )
    } catch (e) {
      console.error('保存缓存数据失败:', e)
    }
  }

  const getGoods = async () => {
    const id = route.params.id
    if (!id) return

    // 先尝试从缓存获取
    const cachedData = getFromCache(id)
    if (cachedData) {
      good.value = cachedData
      return
    }

    // 缓存未命中，显示加载状态并请求数据
    loading.value = true
    try {
      const res = await getDetailAPI(id)
      good.value = res.result
      // 保存到缓存
      saveToCache(id, res.result)
    } catch (error) {
      console.error('获取商品详情失败:', error)
      ElMessage.error('获取商品信息失败，请稍后重试')
    } finally {
      loading.value = false
    }
  }

  // 路由参数变化时重新获取数据
  watch(
    () => route.params.id,
    () => {
      // 清空旧数据，准备加载新数据
      good.value = {}
      getGoods()
    }
  )

  // 组件挂载前就开始加载数据（预加载）
  onBeforeMount(() => {
    getGoods()
  })

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
    <div class="container">
      <!-- 面包屑导航 - 始终显示，不依赖数据加载 -->
      <div class="bread-container">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator=">">
          <!-- 四层面包屑导航 -->
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item
            v-if="good.categories?.[1]"
            :to="{ path: `/category/${good.categories?.[1].id}` }"
          >
            {{ good.categories?.[1].name }}
          </el-breadcrumb-item>
          <el-breadcrumb-item
            v-if="good.categories?.[0]"
            :to="{ path: `/category/sub/${good.categories?.[0].id}` }"
          >
            {{ good.categories?.[0].name }}
          </el-breadcrumb-item>
          <el-breadcrumb-item v-if="good.name">{{ good.name }}</el-breadcrumb-item>
          <el-breadcrumb-item v-else>
            <el-skeleton :rows="1" width="80px"></el-skeleton>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <!-- 商品核心信心区域(图片+基本信息+规格) -->
      <div class="info-cotainer">
        <!-- 弹性布局容器 -->
        <div class="goods-info">
          <!-- 左侧:图片预览 + 销量统计 -->
          <div class="media">
            <template v-if="good.mainPictures && !loading">
              <goods-image :imageList="good.mainPictures"></goods-image>
            </template>
            <template v-else>
              <!-- 图片加载骨架屏 -->
              <div class="skeleton-image">
                <el-skeleton :rows="1" :width="'100%'" :height="'400px'" />
              </div>
            </template>

            <!-- 图片下面的销量/评价/收藏/品牌统计 -->
            <template v-if="good.salesCount !== undefined && !loading">
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
            </template>
            <template v-else>
              <!-- 销量统计骨架屏 -->
              <div class="skeleton-sales">
                <el-skeleton :rows="4" :width="'25%'" :height="'140px'" />
              </div>
            </template>
          </div>

          <!-- 右侧:商品信息+规格选择+加入购物车 -->
          <div class="spec">
            <template v-if="!loading">
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
              <div class="number-box">
                <span class="label">购买数量</span>
                <el-input-number v-model="num" :min="1" @change="countChange" />
              </div>
              <!-- 按钮 -->
              <el-button type="primary" size="large" class="btn" @click="add">加入购物车</el-button>
            </template>
            <template v-else>
              <!-- 右侧信息骨架屏 -->
              <div class="spec-skeleton">
                <el-skeleton :rows="2" width="100%" />
                <el-skeleton :rows="3" width="80%" style="margin-top: 16px" />
                <el-skeleton :rows="6" width="100%" style="margin-top: 16px" />
              </div>
            </template>
          </div>
        </div>

        <!-- 底部区域(详情属性+侧边热榜) -->
        <div class="goods-footer">
          <!-- 左侧:商品详情(属性列表) -->
          <div class="goods-article">
            <!-- 商品详情 -->
            <div class="goods-tabs">
              <nav>
                <a href="#" class="active">商品详情</a>
                <a href="#">规格与包装</a>
                <a href="#">售后服务</a>
              </nav>
              <div class="goods-detail">
                <template v-if="good.details?.properties && !loading">
                  <ul class="attrs">
                    <li v-for="item in good.details.properties" :key="item.value">
                      <span class="dt">{{ item.name }}</span>
                      <span class="dd">{{ item.value }}</span>
                    </li>
                  </ul>
                </template>
                <template v-else>
                  <!-- 属性列表骨架屏 -->
                  <div class="attrs-skeleton">
                    <el-skeleton :rows="10" :cols="2" />
                  </div>
                </template>
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

    <!-- 加载指示器 -->
    <div v-if="loading && !good.details" class="global-loading">
      <div class="loading-content">
        <el-icon class="is-loading"><Loading /></el-icon>
        <p>正在加载商品信息...</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  // 导入图标组件
  @import url('element-plus/dist/index.css');

  // 页面根容器样式
  // 骨架屏相关样式
  .skeleton-image,
  .skeleton-sales,
  .spec-skeleton,
  .attrs-skeleton {
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    margin-bottom: 20px;
  }

  .skeleton-sales {
    display: flex;
    gap: 15px;
  }

  // 全局加载样式
  .global-loading {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }

  .loading-content {
    text-align: center;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  .loading-content .is-loading {
    font-size: 36px;
    color: #409eff;
    margin-bottom: 10px;
  }

  .loading-content p {
    color: #606266;
    margin: 0;
  }
  .xtx-goods-page {
    background-color: #f5f5f5;
    padding-bottom: 60px;
    // 商品核心信息区布局（弹性布局，左右分栏）
    .goods-info {
      min-height: 600px;
      background: #fff;
      display: flex;
      margin-bottom: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      overflow: hidden;
      transition: box-shadow 0.3s ease;
      &:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      }

      // 左侧图片+销量区：固定宽度
      .media {
        width: 580px;
        height: 600px;
        padding: 30px 50px;
        background-color: #fafafa;

        // 销量/评价/收藏/品牌统计样式（横向排列，带分隔线）
        .goods-sales {
          display: flex;
          width: 400px;
          align-items: center;
          text-align: center;
          height: 140px;
          margin-top: 30px;
          padding: 0 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

          li {
            flex: 1; // 四等分
            position: relative;
            transition: transform 0.2s ease;
            &:hover {
              transform: translateY(-3px);
            }

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
                font-size: 14px;
              }

              // 第二行文本（价格色，如销量数字）
              &:nth-child(2) {
                color: $priceColor;
                margin-top: 10px;
                font-size: 18px;
                font-weight: 600;
              }

              // 第三行文本（带图标，hover变品牌色）
              &:last-child {
                color: #666;
                margin-top: 10px;
                font-size: 14px;
                cursor: pointer;
                transition: color 0.2s ease;

                i {
                  color: $xtxColor;
                  font-size: 14px;
                  margin-right: 2px;
                }

                &:hover {
                  color: $xtxColor;
                }
              }
            }
          }
        }
      }

      // 右侧信息区：占剩余宽度
      .spec {
        flex: 1;
        padding: 40px 50px 40px 0;
        position: relative;

        // 商品名称样式
        .g-name {
          font-size: 24px;
          font-weight: 600;
          line-height: 1.4;
          color: #333;
          margin-bottom: 15px;
        }

        // 商品描述样式（灰色）
        .g-desc {
          color: #999;
          margin-top: 10px;
          line-height: 1.5;
          margin-bottom: 20px;
        }

        // 商品价格样式（现价红色、原价划线）
        .g-price {
          margin-top: 15px;
          padding: 20px 0;
          background-color: #fff8f0;
          border-radius: 6px;
          padding-left: 20px;
          margin-bottom: 25px;

          span {
            // 价格前加“¥”符号（伪元素）
            &::before {
              content: '¥';
              font-size: 14px;
            }

            // 现价样式（红色、大字体）
            &:first-child {
              color: $priceColor;
              margin-right: 15px;
              font-size: 26px;
              font-weight: 700;
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
          background: #fafafa;
          width: 100%;
          padding: 20px;
          margin-top: 10px;
          border-radius: 6px;
          margin-bottom: 30px;

          dl {
            padding-bottom: 15px;
            display: flex;
            align-items: flex-start;
            margin-bottom: 15px;
            &:last-child {
              padding-bottom: 0;
              margin-bottom: 0;
            }

            // 标签样式（灰色、固定宽度）
            dt {
              width: 60px;
              color: #999;
              font-weight: 500;
              flex-shrink: 0;
            }

            // 内容样式
            dd {
              color: #666;
              flex: 1;
              line-height: 1.5;

              // 服务项样式（每项前加“•”）
              &:last-child {
                span {
                  margin-right: 15px;
                  padding: 2px 0;

                  &::before {
                    content: '•';
                    color: $xtxColor;
                    margin-right: 4px;
                  }
                }

                // 链接样式（品牌色）
                a {
                  color: $xtxColor;
                  text-decoration: none;
                  transition: opacity 0.2s ease;
                  &:hover {
                    opacity: 0.8;
                  }
                }
              }
            }
          }
        }

        // 数量选择器容器样式
        .number-box {
          display: flex;
          align-items: center;
          margin-top: 30px;
          margin-bottom: 30px;

          .label {
            width: 80px;
            color: #666;
            padding-left: 0;
            font-size: 16px;
          }
        }

        // 加入购物车按钮样式
        .btn {
          margin-top: 30px;
          width: 200px;
          height: 50px;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.3s ease;
          border-radius: 6px;
          box-shadow: 0 2px 8px rgba(230, 0, 0, 0.2);
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(230, 0, 0, 0.3);
          }
          &:active {
            transform: translateY(0);
          }
        }
      }
    }

    // 商品底部区域布局（左右分栏）
    .goods-footer {
      display: flex;
      gap: 20px;

      // 左侧详情区：固定宽度
      .goods-article {
        width: 940px;
        background: #fff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        transition: box-shadow 0.3s ease;
        &:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }
      }

      // 右侧热榜区：固定宽度
      .goods-aside {
        width: 280px;
        min-height: 600px;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
    }
  }

  // 商品详情页签样式（独立作用域，因scoped不影响子组件）
  .goods-tabs {
    min-height: 600px;
    background: #fff;

    nav {
      height: 60px;
      line-height: 60px;
      display: flex;
      border-bottom: 1px solid #f5f5f5; // 底部边框线
      padding: 0 40px;

      a {
        padding: 0 40px;
        font-size: 16px;
        font-weight: 500;
        color: #666;
        position: relative;
        text-decoration: none;
        transition: color 0.2s ease;
        &:hover {
          color: $xtxColor;
        }
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 3px;
          background-color: $xtxColor;
          transition: width 0.3s ease;
        }
        &:hover::after {
          width: 60%;
        }
        &.active {
          color: $xtxColor;
          &::after {
            width: 60%;
          }
        }

        > span {
          color: $priceColor;
          font-size: 14px;
          margin-left: 8px;
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
      margin-bottom: 40px;
      padding: 20px;
      background-color: #fafafa;
      border-radius: 6px;

      li {
        display: flex;
        margin-bottom: 15px;
        width: 50%; // 每列占50%（两列）

        // 属性名称（灰色、固定宽度）
        .dt {
          width: 120px;
          color: #999;
          font-weight: 500;
          flex-shrink: 0;
        }

        // 属性值（深色）
        .dd {
          flex: 1;
          color: #333;
          font-size: 14px;
        }
      }
    }

    // 详情图片样式（全屏宽度）
    > img {
      width: 100%;
      border-radius: 6px;
      margin-bottom: 20px;
      transition: transform 0.3s ease;
      &:hover {
        transform: scale(1.01);
      }
    }
  }

  // 面包屑容器样式（上下间距）
  .bread-container {
    padding: 25px 0;
    margin-bottom: 20px;
  }

  // 数量选择器样式优化
  :deep(.el-input-number) {
    width: 140px;
    .el-input-number__decrease,
    .el-input-number__increase {
      width: 40px;
      height: 40px;
      border-radius: 4px;
      transition: all 0.2s ease;
    }
    .el-input-number__decrease:hover,
    .el-input-number__increase:hover {
      background-color: $xtxColor;
      color: #fff;
      border-color: $xtxColor;
    }
    .el-input__inner {
      height: 40px;
      font-size: 16px;
      text-align: center;
    }
  }
</style>

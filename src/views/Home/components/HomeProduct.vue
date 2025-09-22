<script setup>
  // 导入复用组件,ref创建响应式变量,onMounted组件挂载后触发数据请求
  // 导入获取商品分类管数据的API函数:封装了向后端请求的逻辑
  // 导入商品项组件GoodsItem:统一渲染单个商品(图片,名称,简介,价格)
  import HomePanel from './HomePanel.vue'
  import { ref, onMounted } from 'vue'
  import { getGoodsProductAPI } from '@/apis/home'
  import GoodsItem from '@/components/GoodsItem.vue'

  // 创建响应式变量,初始值为空数组用于存储所有分类馆的数据
  // 数据结构示例：[{ id: 1, name: '美妆馆', picture: 'xxx.jpg', saleInfo: '满200减50', goods: [...] }, ...]
  const goodsProductList = ref([])

  // 定义异步函数:调用API获取分类馆的数据
  const getGoodsProduct = async () => {
    // 发送请求,await等待响应,res是后端返回的结果
    const res = await getGoodsProductAPI()
    // 把后端返回的数据赋值给上面的响应式列表
    goodsProductList.value = res.result
  }

  // 组件挂载后调用getGoodsProduct确保DOM渲染完成后请求数据，
  // 避免数据未到导致的渲染异常
  onMounted(() => {
    getGoodsProduct()
  })
</script>

<template>
  <!-- 根容器:控制整个商品分类馆模板的背景和外间距 -->
  <div class="home-product">
    <!-- 循环渲染每个分类馆:遍历响应式goodsProductList数组,每个item为一个分类馆 -->
    <HomePanel :title="cate.name" v-for="cate in goodsProductList" :key="cate.id">
      <!-- 面板主体内容:通过#main插槽注入每个分类馆的具体内容 -->
      <template #main>
        <!-- 左侧封面+右侧商品列表的flex布局 -->
        <div class="box">
          <!-- 左侧封面:点击跳转 -->
          <RouterLink class="cover" :to="'/'">
            <img v-img-lazy="cate.picture" />
            <strong class="label">
              <span>{{ cate.name }}馆</span>
              <span>{{ cate.saleInfo }}</span>
            </strong>
          </RouterLink>

          <!-- 右侧商品列表:循环渲染当前分类馆的商品 -->
          <ul class="goods-list">
            <li v-for="good in cate.goods" :key="good.id">
              <GoodsItem :good="good"></GoodsItem>
            </li>
          </ul>
        </div>
      </template>
    </HomePanel>
  </div>
</template>

<style scoped lang="scss">
  // 整个商品分类馆模块的基础样式
  .home-product {
    background: #fff;
    margin-top: 20px;

    // 暂时未使用
    .sub {
      margin-bottom: 2px;

      a {
        padding: 2px 12px;
        font-size: 16px;
        border-radius: 4px;

        &:hover {
          background: $xtxColor;
          color: #fff;
        }

        &:last-child {
          margin-right: 80px;
        }
      }
    }

    // 单个分类馆的容器样式
    // 弹性布局:封面和商品列表横向排列
    .box {
      display: flex;
      // 让.cover垂直居中
      align-items: center;
      // 分类馆封面样式

      // 分类馆封面图样式
      .cover {
        width: 240px;
        height: 400px;
        margin-right: 10px;
        // 相对定位:便于子样式的绝对定位
        position: relative;

        // 封面图片样式
        img {
          width: 100%;
          height: 100%;
          // 图片剪裁:保持比例并填满容器,避免变形
          object-fit: cover;
        }

        // 封面标签样式
        .label {
          width: 188px;
          height: 66px;
          display: flex;
          font-size: 18px;
          color: #fff;
          line-height: 66px;
          font-weight: normal;
          position: absolute;
          // 左对齐容器
          left: 0;
          top: 50%;
          // 向上平移50%的自身高度，实现垂直居中的效果
          transform: translate3d(0, -50%, 0);

          // 标签内的两个文字区域
          span {
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            // 第一个区域
            &:first-child {
              width: 76px;
              background: rgba(0, 0, 0, 0.9);
            }
            // 第二个区域
            &:last-child {
              min-width: 0;
              background: rgba(0, 0, 0, 0.7);
              padding: 0 10px;
            }
          }
        }
      }

      // 商品列表容器样式
      .goods-list {
        width: 990px;
        display: flex;
        // 自动换行
        flex-wrap: wrap;
      }
      // 单个商品项的容器样式（包裹着GoodsItem），这里主要制定宽度高度和间距，其他细节内容已在组件里面定义好了
      li {
        width: 240px;
        height: 300px;
        margin-right: 10px;
        margin-bottom: 10px;

        // 最后四个商品项
        &:nth-last-child(-n + 4) {
          margin-bottom: 0;
        }

        // 第4n（4，8，12）个商品
        &:nth-child(4n) {
          margin-right: 0;
        }
      }
    }
  }
</style>

<script setup>
  // 导入商品项组件，导入获取轮播图数据的组合式函数，导入获取分类数据的组合式函数
  import GoodsItem from '@/components/GoodsItem.vue'
  import { useBanner } from './composables/useBanner'
  import { useCategory } from './composables/useCategory'

  // 从组合式函数中获取分类数据（分类详情，子类，商品）和轮播图数据（当前分类的Banner图列表）
  const { categoryData } = useCategory()
  const { bannerList } = useBanner()
</script>

<template>
  <div class="top-category">
    <div class="container m-top-20">
      <div class="bread-container">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ categoryData.name }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="home-banner">
        <el-carousel height="500px">
          <el-carousel-item v-for="item in bannerList" :key="item.id">
            <img :src="item.imgUrl" alt="" />
          </el-carousel-item>
        </el-carousel>
      </div>

      <div class="sub-list">
        <h3>全部分类</h3>
        <ul>
          <li v-for="i in categoryData.children" :key="i.id">
            <RouterLink :to="{ path: `/category/sub/${i.id}` }">
              <img :src="i.picture" alt="" />
              <p>{{ i.name }}</p>
            </RouterLink>
          </li>
        </ul>
      </div>

      <div class="ref-goods" v-for="item in categoryData.children" :key="item.id">
        <div class="head">
          <h3>-{{ item.name }}</h3>
        </div>
        <div class="body">
          <GoodsItem v-for="good in item.goods" :good="good" :key="good.id"></GoodsItem>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  // 根容器样式
  .top-category {
    // 所有h3标签的通用的样式
    h3 {
      font-size: 28px;
      color: #666;
      // 取消粗体
      font-weight: normal;
      // 字体居中
      text-align: center;
      line-height: 100px;
    }

    // 分类列表样式
    .sub-list {
      margin-top: 20px;
      background-color: #fff;

      // 子类列表ul样式
      ul {
        // 弹性布局，横向排列
        display: flex;
        padding: 0 32px;
        // 超出换行显示
        flex-wrap: wrap;

        // 子分类列表项li样式
        li {
          width: 168px;
          height: 160px;

          // 子分类链接样式<RouterLink>
          a {
            text-align: center;
            // 块级元素确保宽高生效
            display: block;
            font-size: 16px;

            // 子类图表样式
            img {
              width: 100px;
              height: 100px;
            }
            // 子分类名称样式
            p {
              line-height: 40px;
            }

            // 鼠标移入悬停时的效果
            &:hover {
              // 定义的主题颜色
              color: $xtxColor;
            }
          }
        }
      }
    }

    // 子分类商品区域样式
    .ref-goods {
      background-color: #fff;
      margin-top: 20px;
      // 相对定位，为子元素的绝对定位提供参考
      position: relative;

      // 商品区域标题部分
      .head {
        // 暂时未使用
        .xtx-more {
          position: absolute;
          top: 20px;
          right: 20px;
        }

        // 暂时未使用
        .tag {
          text-align: center;
          color: #999;
          font-size: 20px;
          position: relative;
          top: -20px;
        }
      }

      // 商品列表的部分
      .body {
        // 弹性布局
        display: flex;
        // 均匀分布，左右的间距相等
        justify-content: space-around;
        // 上下内边距30px
        padding: 0 40px 30px;
      }
    }

    // 面包屑导航样式
    .bread-container {
      padding: 25px 0;
    }

    // 轮播图的样式
    .home-banner {
      width: 1240px;
      height: 500px;
      margin: 0 auto;

      // 轮播图里面的图片样式
      img {
        width: 100%;
        height: 500px;
      }
    }
  }
</style>

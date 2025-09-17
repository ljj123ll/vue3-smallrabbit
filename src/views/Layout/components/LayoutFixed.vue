<template>
  <div class="app-header-sticky" :class="{ show: y > 78 }">
    <div class="container">
      <RouterLink class="logo" to="/" />

      <ul class="app-header-nav">
        <li class="home">
          <RouterLink to="/">首页</RouterLink>
        </li>
        <li v-for="item in categoryStore.categoryList" :key="item.id">
          <RouterLink active-class="active" :to="`/category/${item.id}`">
            {{ item.name }}
          </RouterLink>
        </li>
      </ul>

      <div class="right">
        <RouterLink to="/">品牌</RouterLink>
        <RouterLink to="/">专题</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useScroll } from '@vueuse/core'

  import { useCategoryStore } from '@/stores'
  // 调用useScroll监测窗口滚动，返回值中y是“窗口滚动的y轴坐标”
  const { y } = useScroll(window)
  const categoryStore = useCategoryStore()
</script>

<style scoped lang="scss">
  .app-header-sticky {
    width: 100%;
    height: 80px;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 999;
    background-color: #fff;
    border-bottom: 1px solid #e4e4e4;

    // 关键：默认隐藏样式（向上偏移自身高度+完全透明）
    // 向上偏移100%自身高度
    transform: translateY(-100%);
    opacity: 0;

    &.show {
      transition: all 0.3s linear;
      transform: none;
      opacity: 1;
    }

    // 内容容器样式
    .container {
      display: flex;
      align-items: center;
    }

    .logo {
      width: 200px;
      height: 80px;
      // 背景图：右侧对齐，距离顶部2px，宽度160px，高度自适应。
      background: url('@/assets/images/logo.png') no-repeat right 2px;
      background-size: 160px auto;
    }

    // 右侧快捷入口（品牌+专题）
    .right {
      width: 220px;
      display: flex;
      text-align: center;
      padding-left: 40px;
      border-left: 2px solid $xtxColor;

      // 快捷入口链接样式
      a {
        width: 38px;
        margin-right: 40px;
        font-size: 16px;
        // 行高1，避免高度冗余
        line-height: 1;

        &:hover {
          color: $xtxColor;
        }
      }
    }
  }

  // 分类导航列表样式
  .app-header-nav {
    width: 820px;
    display: flex;
    padding-left: 40px;
    position: relative;
    // 低于根容器
    z-index: 998;

    // 导航项样式
    li {
      margin-right: 40px;
      width: 38px;
      text-align: center;

      // 导航项链接样式
      a {
        font-size: 16px;
        line-height: 32px;
        height: 32px;
        display: inline-block;

        // 鼠标移入效果
        &:hover {
          color: $xtxColor;
          border-bottom: 1px solid $xtxColor;
        }
      }

      // 路由激活样式
      .active {
        color: $xtxColor;
        border-bottom: 1px solid $xtxColor;
      }
    }
  }
</style>

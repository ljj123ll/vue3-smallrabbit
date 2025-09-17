<template>
  <!-- 头部根容器 -->
  <header class="app-header">
    <!-- 头部内容容器，统一布局 -->
    <div class="container">
      <!-- logo区域 -->
      <h1 class="logo">
        <RouterLink to="/">小兔鲜</RouterLink>
      </h1>

      <!-- 首页导航项 -->
      <ul class="app-header-nav">
        <li>
          <RouterLink to="/">首页</RouterLink>
        </li>
        <!-- 动态渲染分类导航项，从Pinia中获取值 -->
        <li class="home" v-for="item in categoryStore.categoryList" :key="item.id">
          <RouterLink active-class="active" :to="`/category/${item.id}`">
            <!-- 分类名称 -->
            {{ item.name }}
          </RouterLink>
        </li>
      </ul>

      <!-- 搜索图标和输入框 -->
      <div class="search">
        <i class="iconfont icon-search"></i>
        <input type="text" placeholder="搜一搜" />
      </div>

      <!-- 购物车组件 -->
      <LayoutCart></LayoutCart>
    </div>
  </header>
</template>

<script setup>
  import { RouterLink } from 'vue-router'
  import { useCategoryStore } from '@/stores'
  import LayoutCart from '@/views/Layout/components/LayoutCart.vue'

  // 创建分类管理状态存储实例，用于获取分类列表数据
  const categoryStore = useCategoryStore()
</script>

<style scoped lang="scss">
  .app-header {
    background: #fff;

    .container {
      display: flex;
      align-items: center;
    }

    .logo {
      width: 200px;

      a {
        display: block;
        height: 132px;
        width: 100%;
        text-indent: -9999px;
        background: url('@/assets/images/logo.png') no-repeat center 18px / contain;
      }
    }

    .app-header-nav {
      width: 820px;
      display: flex;
      padding-left: 40px;
      position: relative;
      z-index: 998;

      li {
        margin-right: 40px;
        width: 38px;
        text-align: center;

        a {
          font-size: 16px;
          line-height: 32px;
          height: 32px;
          display: inline-block;

          &:hover {
            color: $xtxColor;
            border-bottom: 1px solid $xtxColor;
          }
        }

        .active {
          color: $xtxColor;
          border-bottom: 1px solid $xtxColor;
        }
      }
    }

    .search {
      width: 170px;
      height: 32px;
      position: relative;
      border-bottom: 1px solid #e7e7e7;
      line-height: 32px;

      .icon-search {
        font-size: 18px;
        margin-left: 5px;
      }

      input {
        width: 140px;
        padding-left: 5px;
        color: #666;
      }
    }

    .cart {
      width: 50px;

      .curr {
        height: 32px;
        line-height: 32px;
        text-align: center;
        position: relative;
        display: block;

        .icon-cart {
          font-size: 22px;
        }

        em {
          font-style: normal;
          position: absolute;
          right: 0;
          top: 0;
          padding: 1px 6px;
          line-height: 1;
          background: $helpColor;
          color: #fff;
          font-size: 12px;
          border-radius: 10px;
          font-family: Arial;
        }
      }
    }
  }
</style>

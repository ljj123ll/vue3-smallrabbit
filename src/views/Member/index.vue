<!-- 会员中心主页面组件 -->
<script setup>
  // 使用Vue 3的Composition API setup语法糖
  // 本组件作为会员中心的布局容器，包含侧边栏和内容区域
</script>

<template>
  <div class="container">
    <!-- 侧边栏导航区域 -->
    <div class="xtx-member-aside">
      <div class="user-manage">
        <!-- 账户管理区域标题 -->
        <h4>我的账户</h4>
        <div class="links">
          <!-- 个人中心导航链接 -->
          <RouterLink to="/member">个人中心</RouterLink>
        </div>
        <!-- 交易管理区域标题 -->
        <h4>交易管理</h4>
        <div class="links">
          <!-- 我的订单导航链接 -->
          <RouterLink to="/member/order">我的订单</RouterLink>
        </div>
      </div>
    </div>
    <!-- 主内容区域 -->
    <div class="article">
      <!-- 三级路由的挂载点，用于显示子路由对应的组件 -->
      <RouterView />
    </div>
  </div>
</template>

<style scoped lang="scss">
  .container {
    // 布局容器样式，采用弹性布局
    display: flex;
    padding-top: 20px;

    .xtx-member-aside {
      // 侧边栏样式
      width: 220px;
      margin-right: 20px;
      border-radius: 2px;
      background-color: #fff;

      .user-manage {
        // 用户管理区域样式
        background-color: #fff;

        h4 {
          // 区域标题样式
          font-size: 18px;
          font-weight: 400;
          padding: 20px 52px 5px;
          border-top: 1px solid #f6f6f6;
        }

        .links {
          // 链接容器样式
          padding: 0 52px 10px;
        }

        a {
          // 导航链接基础样式
          display: block;
          line-height: 1;
          padding: 15px 0;
          font-size: 14px;
          color: #666;
          position: relative;

          &:hover {
            // 鼠标悬停效果
            color: $xtxColor;
          }

          &.active,
          &.router-link-exact-active {
            // 激活状态样式
            color: $xtxColor;

            &:before {
              // 激活状态前导点显示
              display: block;
            }
          }

          &:before {
            // 激活状态前导点样式
            content: '';
            display: none;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            position: absolute;
            top: 19px;
            left: -16px;
            background-color: $xtxColor;
          }
        }
      }
    }

    .article {
      // 主内容区域样式
      width: 1000px;
      background-color: #fff;
    }
  }
</style>

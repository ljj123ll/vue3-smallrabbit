<!-- 用户信息展示组件 -->
<script setup>
  // 导入用户相关状态管理
  import { useUserStore } from '@/stores'
  // 导入获取推荐商品的API
  import { getLikeAPI } from '@/apis/user'
  // 导入Vue钩子函数和响应式引用
  import { onMounted, ref } from 'vue'

  // 定义变量
  // 猜你喜欢商品列表，使用ref创建响应式数据
  const likeList = ref([])
  // 获取用户存储实例
  const userStore = useUserStore()

  // 获取猜你喜欢商品数据的异步函数
  const getLikeList = async () => {
    // 调用API获取推荐商品，限制返回4个
    const res = await getLikeAPI({ limit: 4 })
    // 更新商品列表数据
    likeList.value = res.result
  }

  // 组件挂载时执行获取推荐商品数据
  onMounted(() => getLikeList())
</script>

<template>
  <!-- 个人信息概览区域 -->
  <div class="home-overview">
    <!-- 用户信息显示区 -->
    <div class="user-meta">
      <!-- 用户头像 -->
      <div class="avatar">
        <img :src="userStore.userInfo?.avatar" />
      </div>
      <!-- 用户名 -->
      <h4>{{ userStore.userInfo?.account }}</h4>
    </div>
    <!-- 快捷功能入口 -->
    <div class="item">
      <a href="javascript:;">
        <span class="iconfont icon-hy"></span>
        <p>会员中心</p>
      </a>
      <a href="javascript:;">
        <span class="iconfont icon-aq"></span>
        <p>安全设置</p>
      </a>
      <a href="javascript:;">
        <span class="iconfont icon-dw"></span>
        <p>地址管理</p>
      </a>
    </div>
  </div>

  <!-- 猜你喜欢商品区域 -->
  <div class="like-container">
    <div class="home-panel">
      <div class="header">
        <h4 data-v-bcb266e0="">猜你喜欢</h4>
      </div>
      <!-- 商品列表 -->
      <div class="goods-list">
        <!-- 遍历商品列表，使用GoodsItem组件展示每个商品 -->
        <GoodsItem v-for="good in likeList" :key="good.id" :good="good" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .home-overview {
    // 用户信息概览样式
    height: 132px;
    background: url(@/assets/images/center-bg.png) no-repeat center / cover;
    display: flex;

    .user-meta {
      // 用户信息区域样式
      flex: 1;
      display: flex;
      align-items: center;

      .avatar {
        // 用户头像样式
        width: 85px;
        height: 85px;
        border-radius: 50%;
        overflow: hidden;
        margin-left: 60px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      h4 {
        // 用户名样式
        padding-left: 26px;
        font-size: 18px;
        font-weight: normal;
        color: white;
      }
    }

    .item {
      // 快捷功能入口样式
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-around;

      &:first-child {
        border-right: 1px solid #f4f4f4;
      }

      a {
        // 快捷入口链接样式
        color: white;
        font-size: 16px;
        text-align: center;

        .iconfont {
          font-size: 32px;
        }

        p {
          line-height: 32px;
        }
      }
    }
  }

  .like-container {
    // 猜你喜欢容器样式
    margin-top: 20px;
    border-radius: 4px;
    background-color: #fff;
  }

  .home-panel {
    // 商品面板样式
    background-color: #fff;
    padding: 0 20px;
    margin-top: 20px;
    height: 400px;

    .header {
      // 面板标题样式
      height: 66px;
      border-bottom: 1px solid #f5f5f5;
      padding: 18px 0;
      display: flex;
      justify-content: space-between;
      align-items: baseline;

      h4 {
        font-size: 22px;
        font-weight: 400;
      }
    }

    .goods-list {
      // 商品列表样式
      display: flex;
      justify-content: space-around;
    }
  }
</style>

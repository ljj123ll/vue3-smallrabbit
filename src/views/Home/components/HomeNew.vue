<template>
  <HomePanel title="新鲜好物" subTitle="新鲜出炉 品质靠谱">
    <template #main>
      <ul class="goods-list">
        <li v-for="item in newGoodsList" :key="item.id">
          <RouterLink :to="`/detail/${item.id}`">
            <img :src="item.picture" alt="" />
            <p class="name">{{ item.name }}</p>
            <p class="price">&yen;{{ item.price }}</p>
          </RouterLink>
        </li>
      </ul>
    </template>
  </HomePanel>
</template>

<script setup>
  // 导入ref创建响应式变量存储商品列表数据，组件挂载完成后的生命周期钩子，用于触发数据请求
  import { ref, onMounted } from 'vue'
  // 导入复用组件，简化代码，统一渲染模板块标题栏
  import HomePanel from './HomePanel.vue'
  // 导入获取新鲜好物数据的API
  import { getNewGoodsAPI } from '@/apis/home'
  // 定义响应式变量，初始值为空数组，用于存储后端返回的新鲜物品数据
  const newGoodsList = ref([])

  //定义异步函数，调用api获取新鲜物品数据
  const getNewGoods = async () => {
    // 调用API函数发起请求：await等待请求完成，res是后端响应对象（含code和result）
    const res = await getNewGoodsAPI()
    newGoodsList.value = res.result
  }
  // 组件挂载完成后调用getNewGoods：确保DOM渲染后再请求数据，避免了数据未到导致的渲染问题
  onMounted(() => getNewGoods())
</script>

<style scoped lang="scss">
  .goods-list {
    display: flex;
    // 水平方向两端对齐，中间距离匀称
    justify-content: space-between;
    height: 406px;

    li {
      width: 306px;
      height: 406px;
      background: #f0f9f4;
      // 过渡动画：所有属性变化持续0.5s，平滑生效
      transition: all 0.5s;

      &:hover {
        // 3d平移：向上移动3px，有立体感
        transform: translate3d(0, -3px, 0);
        // 阴影：底部显示淡阴影，模拟上浮效果
        box-shadow: 0 3px 8px rgb(0 0 0 / 20%);
      }

      img {
        width: 306px;
        height: 306px;
      }
      p {
        font-size: 22px;
        padding-top: 12px;
        text-align: center;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .price {
        color: $priceColor;
      }
    }
  }
</style>

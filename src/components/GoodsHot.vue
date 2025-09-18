<script setup>
  import { fetchHotGoodsAPI } from '@/apis/detail'
  import { ref, computed } from 'vue'
  import { useRoute } from 'vue-router'

  // 定义组件接收的propos
  const props = defineProps({
    type: {
      type: Number,
      default: 1
    }
  })
  // 定义榜单类型与标题的映射关系
  const titleMap = {
    1: '24小时热榜',
    2: '周热榜'
  }
  // 计算属性:根据props.type获取对应的标题
  const title = computed(() => titleMap[props.type])

  // 定义商品列表数据和当前的路由实例,来获取当前路由参数中的id
  const goodList = ref([])
  const route = useRoute()

  const getHotList = async () => {
    const res = await fetchHotGoodsAPI({
      id: route.params.id,
      type: props.type
    })
    goodList.value = res.result
  }

  getHotList()
</script>
<template>
  <div class="goods-hot">
    <h3>{{ title }}</h3>
    <RouterLink
      :to="`/detail/${item.id}`"
      class="goods-item"
      v-for="item in goodList"
      :key="item.id"
    >
      <img :src="item.picture" alt="" />
      <p class="name ellipsis">{{ item.name }}</p>
      <p class="desc ellipsis">{{ item.desc }}</p>
      <p class="price">&yen;{{ item.price }}</p>
    </RouterLink>
  </div>
</template>

<style scoped lang="scss">
  .goods-hot {
    /* 组件根容器样式 */
    h3 {
      /* 榜单标题样式 */
      height: 70px;
      background: $helpColor; /* 背景色（依赖全局变量$helpColor，通常为品牌辅助色） */
      color: #fff; /* 文字白色 */
      font-size: 18px;
      line-height: 70px; /* 行高等于高度，实现垂直居中 */
      padding-left: 25px; /* 左内边距 */
      margin-bottom: 10px; /* 与下方商品区的间距 */
      font-weight: normal; /* 取消粗体 */
    }

    .goods-item {
      /* 单个商品样式 */
      display: block; /* RouterLink默认是a标签（行内元素），改为块级元素方便布局 */
      padding: 20px 30px; /* 内边距 */
      text-align: center; /* 内容居中对齐 */
      background: #fff; /* 白色背景 */
      margin-bottom: 10px; /* 商品之间的间距（原代码未写，通常需要添加） */

      img {
        /* 商品图片样式 */
        width: 160px;
        height: 160px; /* 固定图片尺寸，确保布局整齐 */
      }

      p {
        /* 所有文本段落的公共样式 */
        padding-top: 10px; /* 与上方元素的间距 */
      }

      .name {
        /* 商品名称样式 */
        font-size: 16px; /* 稍大字体突出名称 */
      }

      .desc {
        /* 商品描述样式 */
        color: #999; /* 灰色文字（次要信息） */
        height: 29px; /* 固定高度，避免描述过长导致布局错乱 */
      }

      .price {
        /* 商品价格样式 */
        color: $priceColor; /* 价格色（依赖全局变量$priceColor，通常为红色） */
        font-size: 20px; /* 大字体突出价格 */
      }
    }
  }
</style>

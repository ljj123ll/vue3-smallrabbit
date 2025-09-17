<script setup>
  // 用于定义组件属性props的函数，用于接收父组件传递的数据
  defineProps({
    // 定义了一个名为good的属性
    good: {
      // 类型为对象
      type: Object,
      // 指定默认值为一个空对象
      default: () => {}
    }
  })
</script>

<template>
  <RouterLink :to="`/detail/${good.id}`" class="goods-item">
    <img v-img-lazy="good.picture" alt="" />
    <p class="name ellipsis">{{ good.name }}</p>
    <p class="desc ellipsis">{{ good.desc }}</p>
    <p class="price">&yen;{{ good.price }}</p>
  </RouterLink>
</template>

<style scoped lang="scss">
  .goods-item {
    display: block;
    width: 220px;
    padding: 20px 30px;
    text-align: center;
    transition: all 0.5;

    &:hover {
      transform: translate3d(0, -3px, 0);
      box-shadow: 0 3px 8px rgb(0 0 0 / 20%);
    }

    img {
      width: 160px;
      height: 160px;
    }

    p {
      padding-top: 10px;
    }
    .name {
      font-size: 16px;
    }
    .desc {
      color: #999;
      height: 29px;
    }
    .price {
      color: $priceColor;
      font-size: 20px;
    }
  }
</style>

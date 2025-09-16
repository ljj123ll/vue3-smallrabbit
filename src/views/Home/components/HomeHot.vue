<template>
    <HomePanel title="人气推荐" subTitle="人气爆款 不容错过">
        <template #main>
            <ul class="goods-list">
                <li v-for="item in hotGoodsList" :key="item.id">
                    <RouterLink :to="`/detail/${item.id}`">
                        <!-- 使用v-img-lazy自定义指令实现懒加载，只有当图片进入视口的时候才进行加载 -->
                        <img v-img-lazy="item.picture" alt="">
                        <p class="name">{{ item.title }}</p>
                        <p class="desc">{{ item.alt }}</p>
                    </RouterLink>
                </li>
            </ul>
        </template>
    </HomePanel>
</template>

<script setup>
// 导入ref创建响应式变量存储商品列表数据，组件挂载完成后的生命周期钩子，用于触发数据请求
import { ref } from 'vue'
// 导入复用组件，简化代码，统一渲染模板块标题栏
import HomePanel from './HomePanel.vue';
// 导入获取热门好物数据的API
import { getHotGoodsAPI } from '@/apis/home'
// 定义响应式变量，初始值为空数组，用于存储后端返回的热门物品数据
const hotGoodsList = ref([])

//定义异步函数，调用api获取热门物品数据
const getHotGoods = async () => {
    // 调用API函数发起请求：await等待请求完成，res是后端响应对象（含code和result）
    const res = await getHotGoodsAPI()
    hotGoodsList.value = res.result
}

// 组件初始化时直接调用getHotGoods：
// setup顶层可直接执行异步函数，无序onMounted-因组件初始化阶段会运行顶层代码，
// 效果等同于“挂载后请求”
getHotGoods()



</script>

<style scoped lang="scss">
.goods-list {
    display: flex;
    // 水平方向两端对齐，中间距离匀称
    justify-content: space-between;
    height: 426px;

    li {
        width: 306px;
        height: 406px;

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
        }

        .desc {
            color: #999;
            font-size: 18px;
        }
    }

}
</style>
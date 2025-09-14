<template>
    <div class="app-header-sticky" :class="{ show: y > 78}">
        <div class="container">
            <RouterLink class="logo" to="/" />

            <ul class="app-header-nav">
                <li class="home">
                    <RouterLink to="/">首页</RouterLink>
                </li>
                <li v-for="item in categoryStore.categoryList" :key="item.id">
                    <RouterLink active-class="active" :to="`/category/${item.id}`">{{ item.name }}</RouterLink>
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

</style>
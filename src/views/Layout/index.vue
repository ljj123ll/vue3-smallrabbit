<script setup>
import LayoutNav from '@/views/Layout/components/LayoutNav.vue'
import LayoutFooter from '@/views/Layout/components/LayoutFooter.vue';
import LayoutHeader from '@/views/Layout/components/LayoutHeader.vue';

import { useCategoryStore } from '@/stores'


const categoryStore = useCategoryStore()
categoryStore.getCategory()
</script>



<template>
    <LayoutNav></LayoutNav>
    <LayoutHeader></LayoutHeader>
    <LayoutFooter></LayoutFooter>
</template>


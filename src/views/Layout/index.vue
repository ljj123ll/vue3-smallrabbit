<script setup>
  import LayoutNav from '@/views/Layout/components/LayoutNav.vue'
  import LayoutFooter from '@/views/Layout/components/LayoutFooter.vue'
  import LayoutHeader from '@/views/Layout/components/LayoutHeader.vue'
  import LayoutFixed from '@/views/Layout/components/LayoutFixed.vue'

  import { useCategoryStore } from '@/stores'

  const categoryStore = useCategoryStore()
  categoryStore.getCategory()
</script>

<template>
  <LayoutNav></LayoutNav>
  <LayoutHeader></LayoutHeader>
  <LayoutFixed></LayoutFixed>
  <RouterView />
  <LayoutFooter></LayoutFooter>
</template>

<!-- 
 商品分类详情页面组件（功能并不完整） 
 核心功能是展示某个分类下的二级分类导航，可切换排序的商品列表，
 并支持无限滚动加载更多的商品
 组件通过调用后端API获取数据，结合Element Plus组件（面包屑，标签页）和无限滚动指令
 实现了分类导航-商品排序-无限加载的完整业务流程
 -->
<script setup>
  // 导入分类相关的API函数：一个获取二级分类数据，一个获取分类下的商品列表
  // 导入vue响应式变量和用于注册mounted阶段钩子函数的工具
  // 导入vue-router工具，获取到当前的路由信息
  import { getSubCategoryAPI, getSubCategoryListAPI } from '@/apis/category'
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'

  // 响应式变量，存储二级分类数据。创建路由实例用于获取当前路由信息
  const subCategoryList = ref({})
  const route = useRoute()

  // 创建一个获取二级分类数据的异步函数，根据路由参数id调用API获取数据
  const getSubCategory = async () => {
    // 调用API获取当前路由参数id对应的二级分类数据存储到res
    const res = await getSubCategoryAPI(route.params.id)
    // 把res里面的数据再赋值给subCategoryList
    subCategoryList.value = res.result
  }
  // 初始化调用:组件加载时立即获取二级分类数据
  onMounted(() => getSubCategory())

  // 模块二:分类商品列表的数据
  // 创建响应式变量来存储商品列表数据
  const goodList = ref([])
  // 响应式变量:商品列表请求参数
  const reqData = ref({
    // 分类id,当前页码,每页展示的商品数量,排序字段(默认是发布时间)
    categoryId: route.params.id,
    page: 1,
    pageSize: 20,
    sortField: 'publishTime'
  })

  // 创建一个请求分类商品列表数据的异步函数
  const getGoodList = async () => {
    // 调用post传入reqData(请求参数)
    const res = await getSubCategoryListAPI(reqData.value)
    goodList.value = res.result.items
  }

  onMounted(() => getGoodList())

  // 模块三:排序切换
  // 定义一个函数用于切换标签的时候触发
  const tabChange = () => {
    // 切换排序后重置页面页码为1
    reqData.value.page = 1
    // 重新请求商品列表数据
    getGoodList()
  }

  // 无限滚动
  // 创建响应式变量来控制是否禁用无限滚动
  const disabled = ref(false)

  // 定义函数:无限滚动触发时加载下一页面的商品列表(v-infinite-scroll)
  const load = async () => {
    // 页码+1
    reqData.value.page++
    // 请求下一页的数据
    const res = await getSubCategoryListAPI(reqData.value)
    // 拼接商品列表:将新的数据追加到原有的列表
    goodList.value = [...goodList.value, ...res.result.items]

    // 判断是否无更多的数据,若新页返回空数组,则禁用无限滚动,避免重复请求
    if (res.result.items.length === 0) {
      disabled.value = true
    }
  }
</script>

<template>
  <!-- 页面根容器 -->
  <div class="container">
    <!-- 模块1:面包屑导航 -->
    <div class="bread-container">
      <el-breadcrumb separator=">">
        <!-- 依次是三项面包屑 -->
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <!-- 点击跳转到父分类页 -->
        <el-breadcrumb-item :to="{ path: `/category/${subCategoryList.parentId}` }">
          {{ subCategoryList.parentName }}
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{ subCategoryList.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 模块2:商品排序与列表容器 -->
    <div class="sub-container">
      <!-- 标签页组件,绑定字段reqData.sortField,切换时触发tabChange函数 -->
      <el-tabs v-model="reqData.sortField" @tab-change="tabChange">
        <el-tab-pane label="最新产品" name="publishTime"></el-tab-pane>
        <el-tab-pane label="最热产品" name="orderNum"></el-tab-pane>
        <el-tab-pane label="评论最多" name="evaluateNum"></el-tab-pane>
      </el-tabs>

      <!-- 模块3:商品列表(带无限滚动) -->
      <div class="body" v-infinite-scroll="load" :infinite-scroll-disabled="disabled">
        <goods-item v-for="good in goodList" :key="good.id" :good="good"></goods-item>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  // 模块1：面包屑容器样式
  .bread-container {
    padding: 25px 0; // 上下内边距25px，左右0（与其他模块保持间距）
    color: #666; // 文字颜色：浅灰色（次要信息视觉弱化）
  }

  // 模块2：商品排序与列表容器样式
  .sub-container {
    padding: 20px 10px; // 上下内边距20px，左右10px
    background-color: #fff; // 白色背景（与页面其他灰色区域区分，突出商品）

    // 商品列表容器样式（flex布局实现自动换行）
    .body {
      display: flex; // flex布局：商品横向排列
      flex-wrap: wrap; // 自动换行：超出容器宽度时换行，实现多列布局
      padding: 0 10px; // 左右内边距10px（商品与容器边缘间距）
    }

    // 单个商品项样式（与GoodsItem组件样式一致，避免样式冲突）
    .goods-item {
      display: block; // 块级元素：确保宽高和内边距生效
      width: 220px; // 固定宽度：适配多列布局（如1200px容器可放5列）
      margin-right: 20px; // 右侧外边距20px（商品之间横向间距）
      padding: 20px 30px; // 内边距：商品内容与边框间距
      text-align: center; // 文本居中：提升商品信息美观度

      // 商品图片样式
      img {
        width: 160px; // 图片宽度：小于商品项宽度，预留内边距
        height: 160px; // 图片高度：与宽度一致，确保图片为正方形（避免变形）
      }

      // 商品文本（名称、描述、价格）通用样式
      p {
        padding-top: 10px; // 顶部内边距：文本之间保持间距，避免拥挤
      }

      // 商品名称样式
      .name {
        font-size: 16px; // 字体大小：清晰展示核心信息
      }

      // 商品描述样式
      .desc {
        color: #999; // 浅灰色：弱化次要信息（如商品卖点）
        height: 29px; // 固定高度：避免描述换行导致布局错乱
      }

      // 商品价格样式
      .price {
        color: $priceColor; // 主题价格色（如红色）：突出价格，吸引用户注意
        font-size: 20px; // 字体比名称大：强化价格视觉权重
      }
    }

    // 预留分页容器样式（模板中未使用，可能为后续替换“无限加载”为“分页器”预留）
    .pagination-container {
      margin-top: 20px; // 顶部外边距20px（与商品列表间距）
      display: flex; // flex布局
      justify-content: center; // 水平居中：分页器居中展示
    }
  }
</style>

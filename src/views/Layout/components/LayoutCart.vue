<template>
    <!-- 购物车主容器 图标和悬浮层-->
    <div class="cart">
        <!-- 购物车图标，鼠标不放在上面的时候 -->
        <a class="curr" href="#">
            <!-- 购物车的图标 -->
            <i class="iconfont icon-cart"></i>
            <!-- 显示购物车中商品的总数 -->
            <em>{{ cartStore.cartList.length }}</em>
        </a>

        <!-- 悬浮层 -->
        <div class="layer">
            <!-- 商品列表容器（带滚动条） -->
            <div class="list">
                <!-- 循环渲染购物车中的商品 -->
                <div class="item" v-for="i in cartStore.cartList" :key="i">
                    <!-- 商品链接，点击跳转 -->
                    <RouterLink to="">
                        <!-- 商品的照片：处理图片数据格式（如果是字符串直接用，否则取数组第一个） -->
                        <img :src="typeof i.picture === 'string' ? i.picture : i.picture[0]" alt="" />
                        <!-- 商品的名称和属性区域 -->
                        <div class="center">
                            <!-- 商品的名称 -->
                            <p class="name ellipsis-2">
                                {{ i.name }}
                            </p>
                            <!-- 商品的属性 -->
                            <p class="attr ellipsis-2">
                                {{ i.attrText }}
                            </p>
                        </div>
                        <!-- 商品的价格和数量 -->
                        <div class="right">
                            <!-- 商品单价 -->
                            <p class="price">&yen;{{ i.price }}</p>
                            <!-- 商品数量 -->
                            <p class="count">x{{ i.count }}</p>
                        </div>
                    </RouterLink>

                    <!-- 删除按钮，点击调用Pinia的deleteCart方法删除商品 -->
                    <i class="iconfont icon-close-new" @click="cartStore.deleteCart(i.skuId)"></i>
                </div>
            </div>

            <!-- 底部结算区域 -->
            <div class="foot">
                <!-- 总计信息 -->
                <div class="total">
                    <!-- 商品的总数量 -->
                    <p>共计 {{ cartStore.allCount }} 件商品</p>
                    <!-- 商品的总金额 -->
                    <p>&yen; {{ cartStore.allPrice.toFixed(2) }}</p>
                </div>

                <!-- 结算的按钮：点击进入购物车详情页面 -->
                <el-button size="large" type="primary" @click="$router.push('/cartlist')">
                    去购物车结算</el-button>
            </div>
        </div>
    </div>
</template>


<script setup>
// 导入购物车状态管理的钩子函数
import { useCartStore } from '@/stores'
// 创建购物车状态管理实例（用于获取购物车数据和调用操作方法）
const cartStore = useCartStore()

</script>

<style scoped lang="scss">
// 购物车主容器样式，相对定位用于悬浮层的绝对定位，层级600确保在其他元素上面
.cart {
    width: 50px;
    position: relative;
    z-index: 600;

    // 购物车图标区域样式
    .curr {
        height: 32px;
        line-height: 32px;
        text-align: center;
        position: relative;
        display: block;

        // 图标样式
        .icon-cart {
            font-size: 22px;
        }

        // 商品数量标识样式
        em {
            font-style: normal;
            // 相对于curr的绝对定位
            position: absolute;
            right: 0;
            top: 0;
            padding: 1px 6px;
            line-height: 1;
            background: $helpColor;
            color: #fff;
            font-size: 12px;
            border-radius: 10px;
            font-family: Arial;
        }
    }

    &:hover {
        .layer {
            opacity: 1;
            transform: none;
        }
    }

    .layer {
        /* 悬浮层样式（默认隐藏） */
        opacity: 0;
        /* 透明（隐藏） */
        transition: all 0.4s 0.2s;
        /* 过渡动画：所有属性变化持续0.4s，延迟0.2s执行 */
        transform: translateY(-200px) scale(1, 0);
        /* 初始变形：上移200px+垂直压缩（隐藏效果） */
        width: 400px;
        /* 宽度400px */
        height: 400px;
        /* 高度400px */
        position: absolute;
        /* 绝对定位（相对于.cart） */
        top: 50px;
        /* 距离顶部50px（在图标下方） */
        right: 0;
        /* 右对齐 */
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        /* 阴影效果（立体感） */
        background: #fff;
        /* 白色背景 */
        border-radius: 4px;
        /* 圆角4px */
        padding-top: 10px;
        /* 顶部内边距10px */

        /* 悬浮层顶部的小三角（指示来源） */
        &::before {
            content: '';
            /* 伪元素内容（必须） */
            position: absolute;
            /* 绝对定位 */
            right: 14px;
            /* 距离右侧14px */
            top: -10px;
            /* 超出顶部10px（形成三角朝上） */
            width: 20px;
            /* 宽度20px */
            height: 20px;
            /* 高度20px */
            background: #fff;
            /* 白色背景（与悬浮层一致） */
            transform: scale(0.6, 1) rotate(45deg);
            /* 变形：横向压缩+旋转45度（形成三角） */
            box-shadow: -3px -3px 5px rgba(0, 0, 0, 0.1);
            /* 三角阴影（增强立体感） */
        }

        .foot {
            /* 底部结算区域样式 */
            position: absolute;
            /* 绝对定位（固定在底部） */
            left: 0;
            /* 左对齐 */
            bottom: 0;
            /* 底部对齐 */
            height: 70px;
            /* 高度70px */
            width: 100%;
            /* 宽度100% */
            padding: 10px;
            /* 内边距10px */
            display: flex;
            /* 弹性布局（横向排列总计和按钮） */
            justify-content: space-between;
            /* 两端对齐 */
            background: #f8f8f8;
            /* 浅灰背景（区分列表区域） */
            align-items: center;
            /* 垂直居中 */

            .total {
                /* 总计信息样式 */
                padding-left: 10px;
                /* 左侧内边距10px */
                color: #999;
                /* 文字灰色 */

                p {
                    &:last-child {
                        /* 总价文字样式 */
                        font-size: 18px;
                        /* 字体大小18px */
                        color: $priceColor;
                        /* 价格色（通常为红色） */
                    }
                }
            }
        }
    }

    .list {
        /* 商品列表容器样式 */
        height: 310px;
        /* 高度310px（减去底部70px，总高400px） */
        overflow: auto;
        /* 超出部分显示滚动条 */
        padding: 0 10px;
        /* 左右内边距10px */

        /* 自定义滚动条样式（仅WebKit内核浏览器生效） */
        &::-webkit-scrollbar {
            /* 滚动条整体 */
            width: 10px;
            /* 宽度10px */
            height: 10px;
            /* 高度10px */
        }

        &::-webkit-scrollbar-track {
            /* 滚动条轨道 */
            background: #f8f8f8;
            /* 浅灰背景 */
            border-radius: 2px;
            /* 圆角2px */
        }

        &::-webkit-scrollbar-thumb {
            /* 滚动条滑块 */
            background: #eee;
            /* 浅灰滑块 */
            border-radius: 10px;
            /* 圆角10px */
        }

        &::-webkit-scrollbar-thumb:hover {
            /* 滑块hover状态 */
            background: #ccc;
            /* 深灰滑块 */
        }

        .item {
            /* 单个商品项样式 */
            border-bottom: 1px solid #f5f5f5;
            /* 底部边框（分隔商品） */
            padding: 10px 0;
            /* 上下内边距10px */
            position: relative;
            /* 相对定位（用于删除按钮定位） */

            i {
                /* 删除按钮样式（默认隐藏） */
                position: absolute;
                /* 绝对定位 */
                bottom: 38px;
                /* 距离底部38px */
                right: 0;
                /* 右对齐 */
                opacity: 0;
                /* 透明（隐藏） */
                color: #666;
                /* 颜色灰色 */
                transition: all 0.5s;
                /* 过渡动画（显示/隐藏） */
            }

            /* 商品项hover时显示删除按钮 */
            &:hover {
                i {
                    opacity: 1;
                    /* 不透明（显示） */
                    cursor: pointer;
                    /* 鼠标指针（手型） */
                }
            }

            a {
                /* 商品链接样式（包含图片、名称、价格等） */
                display: flex;
                /* 弹性布局（横向排列内容） */
                align-items: center;
                /* 垂直居中 */

                img {
                    /* 商品图片样式 */
                    height: 80px;
                    /* 高度80px */
                    width: 80px;
                    /* 宽度80px（固定尺寸） */
                }

                .center {
                    /* 商品名称和属性区域 */
                    padding: 0 10px;
                    /* 左右内边距10px */
                    width: 200px;
                    /* 宽度200px（控制文本区域宽度） */

                    .name {
                        /* 商品名称样式 */
                        font-size: 16px;
                        /* 字体大小16px */
                    }

                    .attr {
                        /* 商品属性样式 */
                        color: #999;
                        /* 颜色灰色 */
                        padding-top: 5px;
                        /* 顶部内边距5px（与名称间距） */
                    }
                }

                .right {
                    /* 价格和数量区域 */
                    width: 100px;
                    /* 宽度100px */
                    padding-right: 20px;
                    /* 右侧内边距20px（预留删除按钮空间） */
                    text-align: center;
                    /* 文本居中 */

                    .price {
                        /* 单价样式 */
                        font-size: 16px;
                        /* 字体大小16px */
                        color: $priceColor;
                        /* 价格色（红色） */
                    }

                    .count {
                        /* 数量样式 */
                        color: #999;
                        /* 颜色灰色 */
                        margin-top: 5px;
                        /* 顶部外边距5px（与价格间距） */
                        font-size: 16px;
                        /* 字体大小16px */
                    }
                }
            }
        }
    }


}
</style>
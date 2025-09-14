<script setup>
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

// 定义一个confirm函数处理退出登录的确认逻辑
const confirm = () => {
    // 清除用户信息,store中的方法
    userStore.clearUserInfo()
    // 跳转到登录页面
    router.push('/login')
}
</script>


<template>
    <nav class="app-topnav">
        <div class="container">
            <ul>
                <template v-if="userStore.userInfo.token">
                    <li>
                        <a href="javascript:;">
                            <i class="iconfont icon-user"></i>
                            {{ userStore.userInfo.username }}
                        </a>
                    </li>
                    <li>
                        <el-popconfirm
                            title="确认退出登录吗？"
                            confirm-button-text="确认"
                            cancel-button-text="取消"
                            @confirm="confirm"
                        >
                        <!-- popconfirm显示什么？ -->
                        <template #reference>
                            <a href="javascript:;">退出登录</a>
                        </template>
                        </el-popconfirm>
                    </li>
                    <li><a href="javascript:;">我的订单</a></li>
                    <li><a href="javascript:;">会员中心</a></li>
                </template>
                <template v-else>
                    <li>
                        <RouterLink :to="'/login'">登录</RouterLink>
                    </li>
                    <li><a href="javascript:;">帮助中心</a></li>
                    <li><a href="javascript:;">关于我们</a></li>
                </template>
            </ul>
        </div>
    </nav>
</template>


<style scoped lang="scss">

.app-topnav {
    background: #333;
    ul {
        display:flex;
        height: 53px;
        // 空间分配
        justify-content:flex-end;
        // y上-文字居中于导航栏上
        align-items:center;

        li {
            a {
                padding:0 15px;
                color:#cdcdcd;
                // 行高
                line-height:1;
                // 内联块级元素
                display:inline-block;
                i {
                    font-size: 14px;
                    margin-right: 2px;
                }
                &:hover {
                    color: $xtxColor;
                }
            }
            ~ li {
                a {
                    border-left:2px solid #666;
                }
            }
        }
    }
}
</style>
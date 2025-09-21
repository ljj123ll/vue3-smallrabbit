<script setup>
  import { ElMessage } from 'element-plus'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/stores/modules/user'

  // 响应式表单数据：使用ref创建响应式对象，绑定到表单上面
  const userInfo = ref({
    account: 'zhangsan',
    password: '123456',
    // 是否同意协议
    agree: true
  })

  // 表单验证规则：Element plus 表单验证格式
  const rules = {
    account: [
      {
        required: true,
        message: '请输入手机号',
        trigger: 'blur'
      }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 16, message: '长度在6到12个字符', trigger: 'blur' }
    ],
    agree: [
      {
        validator: (rule, val, callback) => {
          // 自定义验证器：必须同意协议才能通过
          return val ? callback() : new Error('请先同意协议')
        }
      }
    ]
  }

  // 登录逻辑
  const formRef = ref()
  const router = useRouter()
  const userStore = useUserStore()

  // 登录逻辑
  const doLogin = () => {
    // 调用表单验证（Element Plus 表单方法）
    formRef.value.validate(async valid => {
      // console.log(valid) true
      if (valid) {
        // 通过校验
        const { account, password } = userInfo.value
        // 调用状态管理中的登录方法（可能包含接口请求）
        await userStore.getUserInfo({ account, password })
        // 提示用户
        ElMessage.success('登录成功')
        // 跳转首页
        router.push({ path: '/' })
      }
    })
  }
</script>

<template>
  <div>
    <!-- 头部区域 -->
    <header class="login-header">
      <div class="container m-top-20">
        <h1 class="logo">
          <RouterLink to="/">小兔鲜</RouterLink>
        </h1>
        <RouterLink class="entry" to="/">
          进入网站首页
          <i class="iconfont icon-angle-right"></i>
          <i class="iconfont icon-angle-right"></i>
        </RouterLink>
      </div>
    </header>
    <!-- 登录主体区域 -->
    <section class="login-section">
      <!-- 登录表单容器 -->
      <div class="wrapper">
        <nav>
          <a href="#">账户登录</a>
        </nav>
        <!-- 账号登录表单区域 -->
        <div class="account-box">
          <div class="form">
            <el-form
              label-position="right"
              label-width="60px"
              status-icon
              ref="formRef"
              :model="userInfo"
              :rules="rules"
            >
              <el-form-item label="账户" prop="account">
                <el-input v-model="userInfo.account" />
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="userInfo.password" />
              </el-form-item>
              <el-form-item label-width="22px" prop="agree">
                <el-checkbox size="large" v-model="userInfo.agree">
                  我已同意隐私条款和服务条款
                </el-checkbox>
              </el-form-item>
              <!-- 登录按钮 -->
              <el-button size="large" class="subBtn" @click="doLogin">点击登录</el-button>
            </el-form>
          </div>
        </div>
      </div>
    </section>
    <!-- 尾部区域 -->
    <footer class="login-footer">
      <div class="container">
        <p>
          <a href="#">关于我们</a>
          <a href="#">帮助中心</a>
          <a href="#">售后服务</a>
          <a href="#">配送与验收</a>
          <a href="#">商务合作</a>
          <a href="#">搜索推荐</a>
          <a href="#">友情链接</a>
        </p>
        <p>CopyRight &copy; 小兔鲜儿</p>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
  // 头部区域样式
  .login-header {
    background: #fff;
    border-bottom: 1px solid #e4e4e4;

    // 容器样式，弹性布局，垂直方向靠下对齐，水平方向两端对齐
    .container {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
    }

    // logo样式
    .logo {
      width: 200px;

      // logo链接的样式，块级元素，文字缩进（隐藏文字）
      a {
        display: block;
        height: 132px;
        width: 100%;
        text-indent: -9999px;
        background: url('@/assets/images/logo.png') no-repeat center 18px / contain;
      }
    }

    // 进入首页链接的样式
    .entry {
      width: 120px;
      margin-bottom: 38px;
      font-size: 16px;

      // 两个箭头图标的样式
      i {
        font-size: 14px;
        color: $xtxColor;
        letter-spacing: -5px;
        /*字符间距，让两个箭头靠的更近 */
      }
    }
  }

  // 登录主主体区域
  .login-section {
    background: url('@/assets/images/login-bg.png') no-repeat center / cover;
    height: 488px;
    position: relative;
    /*用于子元素的定位 */

    // 登录表单容器
    .wrapper {
      width: 380px;
      background: #fff;
      position: absolute;
      left: 50%;
      top: 54px;
      transform: translate3d(100px, 0, 0);
      /**水平向右偏移100px */
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
      /**阴影效果 */

      // 导航栏样式
      nav {
        font-size: 14px;
        height: 55px;
        margin-bottom: 20px;
        border-bottom: 1px solid #f5f5f5;
        display: flex;
        padding: 0 40px;
        text-align: right;
        align-items: center;

        // 导航链接样式
        a {
          flex: 1;
          line-height: 1;
          display: inline-block;
          font-size: 18px;
          position: relative;
          text-align: center;
        }
      }
    }
  }

  // 页脚样式
  .login-footer {
    padding: 30px 0 50px;
    background: #fff;

    p {
      text-align: center;
      color: #999;
      padding-top: 20px;

      a {
        line-height: 1;
        padding: 0 10px;
        color: #999;
        display: inline-block;

        ~ a {
          border-left: 1px solid #ccc;
        }
      }
    }
  }

  .account-box {
    .form {
      padding: 0 20px 20px 20px;
    }
    .subBtn {
      background: #27ba9b;
      width: 100%;
      color: #fff;
    }
  }
</style>

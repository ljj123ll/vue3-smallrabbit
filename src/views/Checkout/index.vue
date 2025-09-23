<script setup>
  // 1. 导入依赖：API接口、Vue工具、路由、Pinia状态管理
  import { getCheckInfoAPI } from '@/apis/checkout.js'
  import { ref, onMounted } from 'vue'
  import { createOrderAPI } from '@/apis/order'
  import { useRouter } from 'vue-router'
  import { useCartStore } from '@/stores'
  import { addAddressAPI } from '@/apis/user'
  import { ElMessage } from 'element-plus'

  // 初始化核心实例和响应式变量
  const cartStore = useCartStore()
  // 创建路由实例，用于跳转
  const router = useRouter()
  // 存储从API获取的所有结算信息（地址，商品，价格）
  const checkInfo = ref({})
  // 存储收获地址
  const curAddress = ref({})

  // 定义获取结算信息的异步函数
  const getCheckInfo = async () => {
    const res = await getCheckInfoAPI()
    checkInfo.value = res.result
    // 从地址列表中找到默认地址
    const item = checkInfo.value.userAddresses.find(item => item.isDefault === 0)
    // 将默认地址设为当前选中地址
    curAddress.value = item
  }

  // 页面挂载时自动执行“获取结算信息”
  // 生命周期钩子，当页面DOM渲染完成后，调用getCheckInfo初始化函数
  onMounted(() => getCheckInfo())

  // 地址切换时相关的响应式变量
  // 控制切换地址弹窗的显示和隐藏
  const showDialog = ref(false)
  // 存储弹窗中当前高亮选中的地址
  const activeAddress = ref({})

  // 打开切换地址弹窗的函数
  const showDialogFn = () => {
    // 显示弹窗，弹窗初始化时，高亮当前已选中的地址
    showDialog.value = true
    activeAddress.value = curAddress.value
  }

  // 弹窗中切换地址的函数（临时选择）
  const switchAddress = item => {
    activeAddress.value = item
  }

  // 确认切换地址的函数（更行当前选中的地址）
  const changeAddress = () => {
    curAddress.value = activeAddress.value
    showDialog.value = false
  }

  // 核心：创建订单并跳转到支付页面的异步函数
  const createOrder = async () => {
    const res = await createOrderAPI({
      deliveryTimeType: 1,
      payTime: 1,
      payChannel: 1,
      buyerMessage: '',
      goods: checkInfo.value.goods.map(item => {
        return {
          skuId: item.skuId,
          count: item.count
        }
      }),
      // 当前选中的地址ID
      addressId: curAddress.value.id
    })

    // 从API返回结果中提取订单ID
    const orderId = res.result.id
    // 携带订单ID跳转到支付页面（/pay路由），通过query参数传递orderId
    router.push({
      path: '/pay',
      query: {
        id: orderId
      }
    })
    cartStore.updateCartList()
  }

  // 添加地址相关处理函数
  // 控制添加地址弹窗的显示和隐藏
  const showAddDialog = ref(false)
  // 地址表单数据
  const addressForm = ref({
    receiver: '',
    contact: '',
    provinceCode: '',
    cityCode: '',
    countyCode: '',
    address: '',
    isDefault: 0
  })

  // 地址表单引用
  const addressFormRef = ref(null)

  // 打开添加地址弹窗的函数
  const addFlag = () => {
    showAddDialog.value = true
    // 重置表单
    addressForm.value = {
      receiver: '',
      contact: '',
      provinceCode: '',
      cityCode: '',
      countyCode: '',
      address: '',
      isDefault: 0
    }
  }

  // 提交添加地址表单
  const submitAddress = async () => {
    try {
      // 表单验证
      await addressFormRef.value.validate()

      // 验证联系方式（简单的11位手机号验证）
      if (!/^1[3-9]\d{9}$/.test(addressForm.value.contact)) {
        ElMessage.error('请输入正确的手机号码')
        return
      }

      // 调用添加地址API
      await addAddressAPI(addressForm.value)
      // 关闭弹窗
      showAddDialog.value = false
      // 刷新地址列表
      await getCheckInfo()
      // 显示成功提示
      ElMessage.success('地址添加成功')
    } catch (error) {
      if (error !== 'cancel') {
        ElMessage.error('地址添加失败，请重试')
      }
    }
  }
</script>

<template>
  <div class="xtx-pay-checkout-page">
    <!-- 页面固定宽度容器 -->
    <div class="container">
      <!-- 结算内容包裹容器 -->
      <div class="wrapper">
        <!--收货地址区域 -->
        <h3 class="box-title">收货地址</h3>
        <div class="box-body">
          <div class="address">
            <div class="text">
              <div class="none" v-if="!curAddress">您需要先添加收货地址才可提交订单</div>
              <ul v-else>
                <li>
                  <span>
                    收
                    <i />
                    货
                    <i />
                    人:
                  </span>
                  {{ curAddress.receiver }}
                </li>
                <li>
                  <span>联系方式：</span>
                  {{ curAddress.contact }}
                </li>
                <li>
                  <span>收货地址：</span>
                  {{ curAddress.fullLocation }}
                  {{ curAddress.address }}
                </li>
              </ul>
            </div>
            <div class="action">
              <el-button size="large" @click="showDialogFn">切换地址</el-button>
              <el-button size="large" @click="addFlag">添加地址</el-button>
            </div>
          </div>
        </div>

        <!-- 商品信息区域 -->
        <h3 class="box-title">商品信息</h3>
        <div class="box-body">
          <table class="goods">
            <thead>
              <tr>
                <th width="520">商品信息</th>
                <th width="170">单价</th>
                <th width="170">数量</th>
                <th width="170">小计</th>
                <th width="170">实付</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in checkInfo.goods" :key="i.id">
                <td>
                  <!-- 商品图片+名称+属性 -->
                  <a href="javascript:;" class="info">
                    <img :src="i.picture" alt="" />
                    <div class="right">
                      <p>{{ i.name }}</p>
                      <p>{{ i.attrsText }}</p>
                    </div>
                  </a>
                </td>
                <td>&yen;{{ i.price }}</td>
                <td>{{ i.count }}</td>
                <td>&yen;{{ i.totalPrice }}</td>
                <td>&yen;{{ i.totalPayPrice }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 配送事件选择区域 -->
        <h3 class="box-title">配送时间</h3>
        <div class="box-body">
          <a class="my-btn active" href="javascript:;">不限送货时间：周一到周日</a>
          <a class="my-btn" href="javascript:;">工作日送货：周一到周五</a>
          <a class="my-btn" href="javascript:;">双休日送货：周六到周日</a>
        </div>
        <!-- 支付方式选择区域 -->
        <h3 class="box-title">支付方式</h3>
        <div class="box-body">
          <a class="my-btn active" href="javascript:;">在线支付</a>
          <a class="my-btn active" href="javascript:;">货到付款</a>
          <span style="color: #999">货到付款需要支付5元手续费</span>
        </div>

        <!-- 金融明细区域 -->
        <h3 class="box-title">金融明细</h3>
        <div class="box-body">
          <div class="total">
            <dl>
              <dt>商品件数：</dt>
              <dd>{{ checkInfo.summary?.goodsCount }} 件</dd>
            </dl>
            <dl>
              <dt>商品总价：</dt>
              <dd>&yen;{{ checkInfo.summary?.totalPrice.toFixed(2) }}</dd>
            </dl>
            <dl>
              <!-- i标签用于占位对齐 -->
              <dt>
                运
                <i></i>
                费：
              </dt>
              <dd>&yen;{{ checkInfo.summary?.postFee.toFixed(2) }}</dd>
            </dl>
            <dl>
              <dt>应付金额：</dt>
              <dd>&yen;{{ checkInfo.summary?.totalPayPrice.toFixed(2) }}</dd>
            </dl>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="submit">
          <el-button type="primary" size="large" @click="createOrder">提交订单</el-button>
        </div>
      </div>
    </div>
    <!--  切换地址弹窗（Element Plus Dialog组件） -->
    <el-dialog v-model="showDialog" title="选择收货地址" width="50%">
      <div class="addressWrapper">
        <div
          class="text item"
          v-for="item in checkInfo.userAddresses"
          :key="item.id"
          @click="switchAddress(item)"
          :class="{ active: item.id === activeAddress.id }"
        >
          <ul>
            <!-- 标记当前使用的地址 -->
            <li v-if="item.id === curAddress.id">
              <strong>当前使用的地址</strong>
            </li>
            <!-- 地址详情 -->
            <li>
              <span>
                收
                <i />
                货
                <i />
                人
              </span>
              :{{ item.receiver }}
            </li>
            <li>
              <span>联系方式</span>
              :{{ item.contact }}
            </li>
            <li>
              <span>收货地址</span>
              :{{ item.fullLocation + item.address }}
            </li>
          </ul>
        </div>
      </div>

      <!-- 弹窗底部按钮 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showDialog = false">取消</el-button>
          <el-button type="primary" @click="changeAddress">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 添加地址弹窗 -->
    <el-dialog v-model="showAddDialog" title="添加收货地址" width="50%">
      <el-form
        :model="addressForm"
        label-width="100px"
        :rules="{
          receiver: [{ required: true, message: '请输入收货人', trigger: 'blur' }],
          contact: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
          provinceCode: [{ required: true, message: '请选择省市区', trigger: 'blur' }],
          address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
        }"
        ref="addressFormRef"
      >
        <el-form-item label="收货人" prop="receiver">
          <el-input v-model="addressForm.receiver" placeholder="请输入收货人姓名" />
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="addressForm.contact" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item label="所在地区" prop="provinceCode">
          <el-select v-model="addressForm.provinceCode" placeholder="请选择省">
            <el-option label="北京市" value="110000" />
            <el-option label="上海市" value="310000" />
            <el-option label="广东省" value="440000" />
            <el-option label="江苏省" value="320000" />
            <el-option label="浙江省" value="330000" />
          </el-select>
          <el-select v-model="addressForm.cityCode" placeholder="请选择市">
            <el-option label="杭州市" value="330100" />
            <el-option label="宁波市" value="330200" />
            <el-option label="温州市" value="330300" />
          </el-select>
          <el-select v-model="addressForm.countyCode" placeholder="请选择区">
            <el-option label="西湖区" value="330106" />
            <el-option label="余杭区" value="330110" />
            <el-option label="江干区" value="330104" />
          </el-select>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input
            type="textarea"
            v-model="addressForm.address"
            placeholder="请输入详细地址信息"
          />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="addressForm.isDefault" :true-label="0" :false-label="1">
            设为默认地址
          </el-checkbox>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddDialog = false">取消</el-button>
          <el-button type="primary" @click="submitAddress">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
  .xtx-pay-checkout-page {
    margin-top: 20px;

    .wrapper {
      background: #fff;
      padding: 0 20px;

      .box-title {
        font-size: 16px;
        font-weight: normal;
        padding-left: 10px;
        line-height: 70px;
        border-bottom: 1px solid #f5f5f5;
      }

      .box-body {
        padding: 20px 0;
      }
    }
  }

  .address {
    border: 1px solid #f5f5f5;
    display: flex;
    align-items: center;

    .text {
      flex: 1;
      min-height: 90px;
      display: flex;
      align-items: center;

      .none {
        line-height: 90px;
        color: #999;
        text-align: center;
        width: 100%;
      }

      > ul {
        flex: 1;
        padding: 20px;

        li {
          line-height: 30px;

          span {
            color: #999;
            margin-right: 5px;

            > i {
              width: 0.5em;
              display: inline-block;
            }
          }
        }
      }

      > a {
        color: $xtxColor;
        width: 160px;
        text-align: center;
        height: 90px;
        line-height: 90px;
        border-right: 1px solid #f5f5f5;
      }
    }

    .action {
      width: 420px;
      text-align: center;

      .btn {
        width: 140px;
        height: 46px;
        line-height: 44px;
        font-size: 14px;

        &:first-child {
          margin-right: 10px;
        }
      }
    }
  }

  .goods {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;

    .info {
      display: flex;
      text-align: left;

      img {
        width: 70px;
        height: 70px;
        margin-right: 20px;
      }

      .right {
        line-height: 24px;

        p {
          &:last-child {
            color: #999;
          }
        }
      }
    }

    tr {
      th {
        background: #f5f5f5;
        font-weight: normal;
      }

      td,
      th {
        text-align: center;
        padding: 20px;
        border-bottom: 1px solid #f5f5f5;

        &:first-child {
          border-left: 1px solid #f5f5f5;
        }

        &:last-child {
          border-right: 1px solid #f5f5f5;
        }
      }
    }
  }

  .my-btn {
    width: 228px;
    height: 50px;
    border: 1px solid #e4e4e4;
    text-align: center;
    line-height: 48px;
    margin-right: 25px;
    color: #666666;
    display: inline-block;

    &.active,
    &:hover {
      border-color: $xtxColor;
    }
  }

  .total {
    dl {
      display: flex;
      justify-content: flex-end;
      line-height: 50px;

      dt {
        i {
          display: inline-block;
          width: 2em;
        }
      }

      dd {
        width: 240px;
        text-align: right;
        padding-right: 70px;

        &.price {
          font-size: 20px;
          color: $priceColor;
        }
      }
    }
  }

  .submit {
    text-align: right;
    padding: 60px;
    border-top: 1px solid #f5f5f5;
  }

  .addressWrapper {
    max-height: 500px;
    overflow-y: auto;
  }

  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;

    &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;

      &.active,
      &:hover {
        border-color: $xtxColor;
        background: lighten($xtxColor, 50%);
      }

      > ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
      }
    }
  }
</style>

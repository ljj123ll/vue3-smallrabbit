// 倒计时逻辑函数封装
import { computed, onUnmounted, ref } from 'vue'
import dayjs from 'dayjs'
export const useCountDown = () => {
  // 响应式数据
  let timer = null
  const time = ref(0)
  // 1.格式化时间
  const formatTime = computed(() => dayjs.unix(time.value).format('mm分ss秒'))
  // 2.开启倒计时函数
  const start = currentTime => {
    // 开始倒计时
    time.value = currentTime
    timer = setInterval(() => {
      time.value--
    }, 1000)
  }

  // 3.组件销毁时清除定时器
  onUnmounted(() => {
    timer && clearInterval(timer)
  })

  return {
    formatTime,
    start
  }
}

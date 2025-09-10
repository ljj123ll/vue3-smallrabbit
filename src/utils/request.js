import axios from 'axios'
import { useUserStore } from '@/stores/index'
import { ElMessage } from 'element-plus'
import router from '@/router'

// 创建axios实例,相当于先做默认，到api里面再做具体的工作
const request = axios.create({
    baseURL: 'http://pcapi-xiaotuxian-front-devtest.itheima.net',
    timeout: 10000
})


// axios请求拦截器,请求之前做一些事情
request.interceptors.request.use(
    (config) => {
    const userStore = useUserStore();
    const token = userStore.userInfo.token
    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
},
    (e) => Promise.reject(e)
)



// axios响应拦截器
request.interceptors.response.use(
    (res) => res.data,
    (e) => {
        // 统一响应错误
        const userStore = useUserStore()
        console.log(e)
        ElMessage.warning(e.response?.data?.message || '请求失败')
        // 401 token过期
        if(e.response?.status === 401) {
            userStore.clearUserInfo()
            router.push('/login')
        }
        return Promise.reject(e)
    }
)


export default request
import request from '@/utils/request'

// 登录接口
export const loginAPI = ({ account, password }) => {
  return request({
    url: '/login',
    method: 'POST',
    data: {
      account,
      password
    }
  })
}

// 猜你喜欢数据请求
export const getLikeAPI = ({ limit = 4 }) => {
  return request({
    url: '/goods/relevant',
    method: 'GET',
    params: {
      limit
    }
  })
}

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

// 添加收货地址
export const addAddressAPI = data => {
  return request({
    url: '/member/address',
    method: 'POST',
    data
  })
}

// 获取收货地址列表
export const getAddressListAPI = () => {
  return request({
    url: '/member/address',
    method: 'GET'
  })
}

// 更新收货地址
export const updateAddressAPI = (id, data) => {
  return request({
    url: `/member/address/${id}`,
    method: 'PUT',
    data
  })
}

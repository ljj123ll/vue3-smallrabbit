import request from '@/utils/request'

// 获取商品详情
export const getDetailAPI = id => {
  return request({
    url: '/goods',
    method: 'GET',
    params: {
      id
    }
  })
}

// 获取热榜商品
export const fetchHotGoodsAPI = ({ id, type, limit = 3 }) => {
  return request({
    url: '/goods/hot',
    method: 'GET',
    // id商品id，type：1代表相关商品，2代表热榜商品，limit：获取条数
    params: {
      id,
      type,
      limit
    }
  })
}

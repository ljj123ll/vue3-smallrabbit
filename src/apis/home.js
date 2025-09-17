import request from '@/utils/request'

// 获取轮播图
export const getBannerAPI = () => {
  return request({
    url: '/home/banner',
    method: 'GET'
  })
}

// 获取新鲜好物数据
export const getNewGoodsAPI = () => {
  return request({
    url: '/home/new',
    method: 'GET'
  })
}

// 获取人气好物数据
export const getHotGoodsAPI = () => {
  return request({
    url: '/home/hot',
    method: 'GET'
  })
}

// 获取商品数据
export const getGoodsProductAPI = () => {
  return request({
    url: '/home/goods',
    method: 'GET'
  })
}

import request from '@/utils/request'

// 根据分类id获取顶级分类的数据
export const getTopCategoryAPI = id => {
  return request({
    url: '/category',
    method: 'GET',
    params: {
      // 参数通过params传递，会拼接到URL查询字符中
      id
    }
  })
}

// 获取轮播图数据
export const getBannerAPI = (params = {}) => {
  // 1表示首页轮播图，2表示商品页轮播图
  const { distributionSite = '1' } = params
  return request({
    url: '/home/banner',
    method: 'GET',
    params: {
      distributionSite
    }
  })
}
// 二级分类数据的获取
export const getSubCategoryAPI = id => {
  return request({
    url: '/category/sub/filter',
    method: 'GET',
    params: {
      id
    }
  })
}

// 获取分类下的商品列表数据
export const getSubCategoryListAPI = data => {
  return request({
    url: '/category/goods/temporary',
    method: 'POST',
    // 请求体数据：包含分页，筛选条件等（如页码，每页条数，价格区间）
    data
  })
}

import request from '@/utils/request'

// 获取顶级分类的数据
export const getTopCategoryAPI (id) => {
    return request({
        url: '/category',
        method: 'GET',
        params: {
            id
        }
    })
}

// 获取轮播图数据
export const getBannerAPI = (params = {}) => {
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

// 获取分类下的商品列表数据
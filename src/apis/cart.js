import request from '@/utils/request'

// 把商品加入购物车
export const addCartListAPI = ({ skuId, count }) => {
    return request({
        url:'/member/cart',
        method: 'POST',
        data: {
            skuId,
            count
        }
    })
}


// 获取购物车接口
export const getCartListAPI = () => {
    return request({
        url: '/member/cart',
        method: 'GET'
    })
}

// 删除购物车 ids数组
export const deleteCartListAPI = (ids) => {
    return request({
        url: '/member/cart',
        method:'DELETE',
        data: {
            ids
        }
    })
}

// 合并购物车
export const mergeCartAPI = (data) => {
    return request({
        url: '/member/cart/merge',
        method: 'POST',
        data
    })
}


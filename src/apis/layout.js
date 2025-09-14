import request from '@/utils/request.js'

export const getCategoryAPI = () => {
    return request ({
        url: '/home/category/head',
        method: 'GET'
    })
}

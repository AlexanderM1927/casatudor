import qs from 'qs'

export default class ProductService {
    config = null
    constructor (config) {
        this.config = config
    }
    async getProducts(page = 1) {
        const query = qs.stringify({
            populate: '*',
            sort: ['id:desc'],
            pagination: {
                page: page,
                pageSize: 20
            },
        })
        return await $fetch(this.config.public.apiBase + '/products?' + query)
    }
    async getProductsByCategory(page = 1, categoryId) {
        const query = qs.stringify({
            populate: '*',
            sort: ['id:desc'],
            pagination: {
                page: page,
                pageSize: 20
            },
            filters: {
                category: {
                    id: {
                        $eq: categoryId
                    }
                }
            }
        })
        return await $fetch(this.config.public.apiBase + '/products?' + query)
    }
    async getSingleProduct(id) {
        const query = qs.stringify({
            populate: '*',
            filters: {
                id: id
            }
        })
        return await $fetch(this.config.public.apiBase + '/products?' + query)
    }
}
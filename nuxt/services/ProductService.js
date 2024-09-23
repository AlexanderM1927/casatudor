import qs from 'qs'

export default class ProductService {
    config = null
    constructor (config) {
        this.config = config
    }
    async getHomeProducts(page = 1) {
        const query = qs.stringify({
            populate: '*',
            sort: ['id:desc'],
            pagination: {
                page: page,
                pageSize: 6
            },
        })
        return await $fetch(this.config.public.apiBase + '/products?' + query)
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
    async getProductsWithFilters(page = 1, name, category, sort) {
        const queryObject = {
            populate: '*',
            sort: ['id:desc'],
            pagination: {
                page: page,
                pageSize: 20
            }
        }
        if (name != '') {
            queryObject.filters = {
                name: {
                    $containsi: name
                }
            }
        }
        if (sort != '') {
            queryObject.sort = [sort]
        }
        if (category) {
            queryObject.filters = {
                category: {
                    id: {
                        $eq: category.id
                    }
                }
            }
        }
        const query = qs.stringify(queryObject)
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
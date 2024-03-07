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
    async getProductsByName(page = 1, name, sort) {
        const queryObject = {
            populate: '*',
            pagination: {
                page: page,
                pageSize: 20
            },
            filters: {
                name: {
                    $containsi: name
                }
            }
        }
        if (sort != '') {
            queryObject.sort = [sort]
        }
        const query = qs.stringify(queryObject)
        return await $fetch(this.config.public.apiBase + '/products?' + query)
    }
    async getProductsSorByOrder(page = 1, sort, name) {
        const queryObject = {
            populate: '*',
            sort: [sort],
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
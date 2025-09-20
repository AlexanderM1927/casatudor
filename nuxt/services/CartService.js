import qs from 'qs'

export default class CartService {
    config = null
    constructor (config) {
        this.config = config
    }
    async createCart(params) {
        return await $fetch(this.config.public.apiBase + '/carts', {
            headers: { Authorization: `Bearer ${params.token}` },
            method: 'POST',
            body: params
        })
    }
    async updateCart(id, params) {
        return await $fetch(this.config.public.apiBase + '/carts/' + id, {
            headers: { Authorization: `Bearer ${params.token}` },
            method: 'PUT',
            body: params
        })
    }
    async getUserCart(params) {
        const query = qs.stringify({
            populate: [
                'products.product.image'
            ],
            sort: ['id:desc'],
            pagination: {
                page: 1,
                pageSize: 1
            },
            filters: {
                users_permissions_user: params.userId
            }
        })
        return await $fetch(this.config.public.apiBase + '/carts?' + query, {
            headers: { Authorization: `Bearer ${params.token}` },
            method: 'GET',
        })
    }
}
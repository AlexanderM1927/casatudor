import qs from 'qs'

export default class OrderService {
    config = null
    constructor (config) {
        this.config = config
    }
    get apiBase() {
        return this.config.apiBaseServer || this.config.public.apiBase
    }
    async getUserOrders(params) {
        const query = qs.stringify({
            populate: [
                'users_permissions_user',
                'invoice.products.product.image',
            ],
            sort: ['id:desc'],
            pagination: {
                page: params.page,
                pageSize: 20
            },
            filters: {
                users_permissions_user: params.userId
            }
        })
        return await $fetch(this.apiBase + '/orders?' + query, {
            headers: { Authorization: `Bearer ${params.token}` },
            method: 'GET',
        })
    }
}
import qs from 'qs'

export default class PromotionService {
    config = null
    constructor (config) {
        this.config = config
    }
    async getPromotions() {
        const query = qs.stringify({
            populate: '*',
            sort: ['id:desc'],
            pagination: {
                page: 1,
                pageSize: 1
            },
            filters: {
                isEnabled: true
            }
        })
        return await $fetch(this.config.public.apiBase + '/promotions?' + query)
    }
    async getSinglePromotion(id) {
        const query = qs.stringify({
            populate: 'products.image',
            filters: {
                id: id,
                isEnabled: true
            }
        })
        return await $fetch(this.config.public.apiBase + '/promotions?' + query)
    }
}
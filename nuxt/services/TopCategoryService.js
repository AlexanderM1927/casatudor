import qs from 'qs'

export default class PromotionService {
    config = null
    constructor (config) {
        this.config = config
    }
    async getTopCategories() {
        const query = qs.stringify({
            populate: 'categories.image',
            sort: ['id:desc'],
            pagination: {
                page: 1,
                pageSize: 3
            }
        })
        return await $fetch(this.config.public.apiBase + '/top-categories?' + query)
    }
}
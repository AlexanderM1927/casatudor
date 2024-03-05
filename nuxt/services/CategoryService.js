import qs from 'qs'

export default class CategoryService {
    config = null
    constructor (config) {
        this.config = config
    }
    async getCategories(page = 1) {
        const query = qs.stringify({
            populate: '*',
            sort: ['name:desc'],
            pagination: {
                page: page,
                pageSize: 20
            },
        })
        return await $fetch(this.config.public.apiBase + '/categories?' + query)
    }
}
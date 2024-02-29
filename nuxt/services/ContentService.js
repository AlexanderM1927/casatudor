import qs from 'qs'

export default class ContentService {
    config = null
    constructor (config) {
        this.config = config
    }
    async getContent() {
        const query = qs.stringify({
            populate: '*',
            sort: ['id:desc'],
            pagination: {
                page: 1,
                pageSize: 1
            }
        })
        return await $fetch(this.config.public.apiBase + '/contents?' + query)
    }
}
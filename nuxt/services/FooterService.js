import qs from 'qs'

export default class FooterService {
    config = null
    constructor (config) {
        this.config = config
    }
    async getFooter() {
        const query = qs.stringify({
            populate: '*',
            sort: ['id:desc'],
            pagination: {
                page: 1,
                pageSize: 1
            }
        })
        return await $fetch(this.config.public.apiBase + '/footer?' + query)
    }
}
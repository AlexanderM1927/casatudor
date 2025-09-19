import qs from 'qs'

export default class ContentService {
    config = null
    constructor (config) {
        this.config = config
    }
    async getContent() {
        const query = qs.stringify({
            populate: '*'
        })
        return await $fetch(this.config.public.apiBase + '/content?' + query)
    }
}
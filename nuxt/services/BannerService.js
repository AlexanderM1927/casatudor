import qs from 'qs'

export default class BannerService {
    config = null
    constructor (config) {
        this.config = config
    }
    async getBanner() {
        const query = qs.stringify({
            populate: {
                image: {
                    fields: ['url']
                }
            }
        })
        return await $fetch(this.config.public.apiBase + '/banner?' + query)
    }
}

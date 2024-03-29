import qs from 'qs'

export default class PageService {
    config = null
    constructor (config) {
        this.config = config
    }
    async getPages(page = 1) {
        const query = qs.stringify({
            populate: '*',
            sort: ['sort:asc'],
            pagination: {
                page: page,
                pageSize: 20
            },
            populate: {
                subpages: {
                  fields: ['urlTitle', 'urlId']
                }
            }
        })
        return await $fetch(this.config.public.apiBase + '/pages?' + query)
    }
    async getSinglePageByUrlId(id) {
        const query = qs.stringify({
            populate: '*',
            filters: {
                urlId: id
            }
        })
        return await $fetch(this.config.public.apiBase + '/pages?' + query)
    }
}
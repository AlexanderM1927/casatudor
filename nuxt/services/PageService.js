import qs from 'qs'

export default class PageService {
    config = null
    constructor (config) {
        this.config = config
    }
    async getPages(page = 1) {
        const query = qs.stringify({
            sort: ['sort:asc'],
            pagination: {
                page: page,
                pageSize: 20
            },
            populate: {
                subpages: {
                    fields: ['urlTitle', 'urlId', 'sort']
                },
                categories: {
                    fields: ['id', 'name']
                }
            }
        })
        return await $fetch(this.config.public.apiBase + '/pages?' + query)
    }
    async getSinglePageByUrlId(id) {
        const query = qs.stringify({
            populate: {
                subpages: {
                    fields: ['urlTitle', 'urlId', 'sort']
                },
                categories: {
                    populate: ['image'],
                    fields: ['id', 'name']
                }
            },
            filters: {
                urlId: id
            }
        })
        return await $fetch(this.config.public.apiBase + '/pages?' + query)
    }
}
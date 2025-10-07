import qs from 'qs'

export default class TopCategoryService {
    config = null
    constructor (config) {
        this.config = config
    }
    async getTopCategories() {
        const query = qs.stringify({
            populate: {
                category: {
                    populate: {
                        category: {
                            fields: ['id', 'name']
                        },
                        image: {
                            fields: ['url']
                        }
                    }
                }
            },
            sort: ['id:desc'],
            pagination: {
                page: 1,
                pageSize: 3
            }
        })
        return await $fetch(this.config.public.apiBase + '/top-categories?' + query)
    }
}
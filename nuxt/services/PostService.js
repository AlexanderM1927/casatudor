import qs from 'qs'

export default class PostService {
    config = null
    constructor (config) {
        this.config = config
    }
    async getHomePosts(page = 1) {
        const query = qs.stringify({
            populate: '*',
            sort: ['id:desc'],
            pagination: {
                page: page,
                pageSize: 4
            },
        })
        return await $fetch(this.config.public.apiBase + '/posts?' + query)
    }
    async getPosts(page = 1) {
        const query = qs.stringify({
            populate: '*',
            sort: ['id:desc'],
            pagination: {
                page: page,
                pageSize: 20
            },
        })
        return await $fetch(this.config.public.apiBase + '/posts?' + query)
    }
    async getSinglePost(id) {
        const query = qs.stringify({
            populate: '*',
            filters: {
                id: id
            }
        })
        return await $fetch(this.config.public.apiBase + '/posts?' + query)
    }
}
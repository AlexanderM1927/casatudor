import qs from 'qs'

export default {
    async getHomePosts(config, page = 1) {
        const query = qs.stringify({
            populate: '*',
            sort: ['id:desc'],
            pagination: {
                page: page,
                pageSize: 4
            },
        })
        return await $fetch(config.public.apiBase + '/posts?' + query)
    },
    async getPosts(config, page = 1) {
        const query = qs.stringify({
            populate: '*',
            sort: ['id:desc'],
            pagination: {
                page: page,
                pageSize: 20
            },
        })
        return await $fetch(config.public.apiBase + '/posts?' + query)
    },
    async getSinglePost(config, id) {
        const query = qs.stringify({
            populate: '*',
            filters: {
                id: id
            }
        })
        return await $fetch(config.public.apiBase + '/posts?' + query)
    }
}
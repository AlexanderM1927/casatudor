import qs from 'qs'
const config = useRuntimeConfig()

export default {
    async getHomePosts(page = 1) {
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
    async getPosts(page = 1) {
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
    async getSinglePost(id) {
        const query = qs.stringify({
            populate: '*',
            filters: {
                id: id
            }
        })
        return await $fetch(config.public.apiBase + '/posts?' + query)
    }
}
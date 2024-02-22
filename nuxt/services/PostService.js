import qs from 'qs'

export default {
    async getPosts(config) {
        const query = qs.stringify({
            populate: '*',
            sort: ['id:desc'],
            pagination: {
                page: 1,
                pageSize: 4
            },
        })
        return await $fetch(config.public.apiBase + '/posts?' + query)
    }
}
import qs from 'qs'

export default {
    async getContent(config) {
        const query = qs.stringify({
            populate: '*',
            sort: ['id:desc'],
            pagination: {
                page: 1,
                pageSize: 1
            }
        })
        return await $fetch(config.public.apiBase + '/contents?' + query)
    }
}
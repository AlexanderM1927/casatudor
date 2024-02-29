import qs from 'qs'
const config = useRuntimeConfig()

export default {
    async getContent() {
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
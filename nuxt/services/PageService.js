import qs from 'qs'
const config = useRuntimeConfig()

export default {
    async getPages(page = 1) {
        const query = qs.stringify({
            populate: '*',
            sort: ['id:desc'],
            pagination: {
                page: page,
                pageSize: 20
            },
        })
        return await $fetch(config.public.apiBase + '/pages?' + query)
    },
    async getSinglePage(id) {
        const query = qs.stringify({
            populate: '*',
            filters: {
                id: id
            }
        })
        return await $fetch(config.public.apiBase + '/pages?' + query)
    }
}
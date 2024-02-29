import qs from 'qs'

export default {
    async getProducts(config, page = 1) {
        const query = qs.stringify({
            populate: '*',
            sort: ['id:desc'],
            pagination: {
                page: page,
                pageSize: 20
            },
        })
        return await $fetch(config.public.apiBase + '/products?' + query)
    },
    async getSingleProduct(config, id) {
        const query = qs.stringify({
            populate: '*',
            filters: {
                id: id
            }
        })
        return await $fetch(config.public.apiBase + '/products?' + query)
    }
}
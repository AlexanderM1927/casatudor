import qs from 'qs'
const config = useRuntimeConfig()

export default {
    async createUser(params) {
        return await $fetch(config.public.apiBase + '/users', {
            method: 'POST',
            body: params
        })
    },
}
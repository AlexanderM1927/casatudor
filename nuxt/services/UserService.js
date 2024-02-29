import qs from 'qs'
const config = useRuntimeConfig()

export default {
    async createUser(params) {
        return await $fetch(config.public.apiBase + '/auth/local/register', {
            method: 'POST',
            body: params
        })
    },
}
import qs from 'qs'

export default class UserService {
    config = null
    constructor (config) {
        this.config = config
    }
    async login(params) {
        return await $fetch(this.config.public.apiBase + '/auth/local/', {
            method: 'POST',
            body: params
        })
    }
    async createUser(params) {
        return await $fetch(this.config.public.apiBase + '/auth/local/register', {
            method: 'POST',
            body: params
        })
    }
}
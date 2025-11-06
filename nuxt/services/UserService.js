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
    async me(params) {
        return await $fetch(this.config.public.apiBase + '/users/me', {
            method: 'GET',
            headers: { Authorization: `Bearer ${params.token}` }
        })
    }
    async forgotPassword(email) {
        return await $fetch(this.config.public.apiBase + '/auth/forgot-password', {
            method: 'POST',
            body: { email }
        })
    }
    async resetPassword(code, password, passwordConfirmation) {
        return await $fetch(this.config.public.apiBase + '/auth/reset-password', {
            method: 'POST',
            body: { code, password, passwordConfirmation }
        })
    }
}
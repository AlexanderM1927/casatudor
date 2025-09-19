import qs from 'qs'

export default class UserService {
    config = null
    constructor (config) {
        this.config = config
    }
    async createCart(params) {
        return await $fetch(this.config.public.apiBase + '/carts', {
            method: 'POST',
            body: params
        })
    }
}
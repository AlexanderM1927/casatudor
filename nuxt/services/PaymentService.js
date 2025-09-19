import qs from 'qs'

export default class UserService {
    config = null
    constructor (config) {
        this.config = config
    }
    async processPayment(params) {
        return await $fetch(this.config.public.apiBase + '/wompi/init', {
            method: 'POST',
            body: params
        })
    }
}
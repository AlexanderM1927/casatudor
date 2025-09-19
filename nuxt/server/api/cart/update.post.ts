import { defineEventHandler, readBody, createError, getCookie } from 'h3'
import CartService from '~/services/CartService'

export default defineEventHandler(async (event) => {
    const { id, data } = await readBody(event)
    const config = useRuntimeConfig()
    const cartService = new CartService(config)
    const token = getCookie(event, config.jwtCookie)
    if (!token) throw createError({ statusCode: 401, statusMessage: 'No autenticado' })
    try {
        const cart = await cartService.updateCart(id, { 
            data,
            token
        })

        return cart
    } catch (error: any) {
    }

})

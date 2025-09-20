import { defineEventHandler, getCookie, createError } from 'h3'
import CartService from '~/services/CartService'
import UserService from '~/services/UserService'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const cartService = new CartService(config)
    const userService = new UserService(config)
    const token = getCookie(event, config.jwtCookie)
    if (!token) throw createError({ statusCode: 401, statusMessage: 'No autenticado' })
    // Obtener el usuario desde el token
    const user: any = await userService.me({ token })
    
    // Usar el ID del usuario obtenido
    const cart = await cartService.getUserCart({ userId: user.id, token })
    return { cart }
})

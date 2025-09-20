import { defineEventHandler, getCookie, createError } from 'h3'
import OrderService from '~/services/OrderService'
import UserService from '~/services/UserService'

export default defineEventHandler(async (event) => {
    const { page } = getQuery(event)
    const config = useRuntimeConfig()
    const orderService = new OrderService(config)
    const userService = new UserService(config)
    const token = getCookie(event, config.jwtCookie)
    if (!token) throw createError({ statusCode: 401, statusMessage: 'No autenticado' })
    // Obtener el usuario desde el token
    const user: any = await userService.me({ token })
    // Usar el ID del usuario obtenido
    const orders = await orderService.getUserOrders({ userId: user.id, token, page: page || 1 })
    return { orders }
})

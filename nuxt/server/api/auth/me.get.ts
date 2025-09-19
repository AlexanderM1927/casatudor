import { defineEventHandler, getCookie, createError } from 'h3'
import UserService from '~/services/UserService'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const userService = new UserService(config)
    const token = getCookie(event, config.jwtCookie)
    if (!token) throw createError({ statusCode: 401, statusMessage: 'No autenticado' })

    const user = await userService.me({ token })
    return { user }
})

import { defineEventHandler, getCookie, createError, getRequestHeader } from 'h3'
import UserService from '~/services/UserService'

export default defineEventHandler(async (event) => {
    // Detectar si es un bot
    const userAgent = getRequestHeader(event, 'user-agent') || ''
    const isBot = /googlebot|bingbot|yandex|baiduspider|twitterbot|facebookexternalhit|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|slackbot|vkshare|w3c_validator/i.test(userAgent)
    
    // Si es un bot, retornar 404 silenciosamente (sin error)
    if (isBot) {
        setResponseStatus(event, 404)
        return { statusCode: 404, message: 'Not available' }
    }

    const config = useRuntimeConfig()
    const userService = new UserService(config)
    const token = getCookie(event, config.jwtCookie)
    if (!token) throw createError({ statusCode: 401, statusMessage: 'No autenticado' })

    const user = await userService.me({ token })
    return { user }
})


import { defineEventHandler, readBody, setCookie, createError } from 'h3'
import UserService from '~/services/UserService'

export default defineEventHandler(async (event) => {
    const { identifier, password } = await readBody(event)
    if (!identifier || !password) throw createError({ statusCode: 400, statusMessage: 'Faltan credenciales' })
    const config = useRuntimeConfig()
    const userService = new UserService(config)
    try {
        const res: any = await userService.login({ identifier, password })

        setCookie(event, config.jwtCookie, res.jwt, {
            httpOnly: true,
            sameSite: 'lax',
            secure: true,
            path: '/',
            maxAge: 60 * 60 * 24 * 7
        })

        return { user: res.user }
    } catch (error: any) {
    }

})

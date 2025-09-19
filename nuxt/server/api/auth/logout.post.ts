import { defineEventHandler, setCookie } from 'h3'
export default defineEventHandler((event) => {
    const config = useRuntimeConfig()
    setCookie(event, config.jwtCookie, '', { 
        httpOnly: true, 
        sameSite: 'lax', 
        secure: process.env.NODE_ENV === 'production', 
        path: '/', 
        maxAge: 0 
    })
    return { ok: true }
})

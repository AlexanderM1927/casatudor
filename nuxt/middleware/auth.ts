const isAuthenticated = (() => {
    return localStorage.getItem('jwt') !== '' && localStorage.getItem('jwt') !== null
})

export default defineNuxtRouteMiddleware((to, from) => {
    if (!isAuthenticated()) {
        return navigateTo('/login')
    }
})
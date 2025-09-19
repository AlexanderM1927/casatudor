export default defineNuxtRouteMiddleware(async (to) => {
    console.log('middleware:', to)
    const { loggedIn, fetchMe } = useAuth()
    if (!loggedIn.value) {
        await fetchMe()
    }
    console.log('Middleware auth - loggedIn:', loggedIn.value)
    if (to.meta.requiresAuth && !loggedIn.value) {
        return navigateTo('/login?next=' + encodeURIComponent(to.fullPath))
    }
})
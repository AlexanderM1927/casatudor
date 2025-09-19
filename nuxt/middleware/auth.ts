export default defineNuxtRouteMiddleware(async (to) => {
    // Skip auth check during server-side rendering
    if (process.server) return
    
    const { loggedIn, fetchMe } = useAuth()
    
    // Try to fetch user if not logged in
    if (!loggedIn.value) {
        try {
            await fetchMe()
        } catch (error) {
            // Failed to authenticate
            console.log('Authentication failed in middleware')
        }
    }
    
    // Redirect if page requires auth and user is not logged in
    if (to.meta.requiresAuth && !loggedIn.value) {
        return navigateTo('/login?next=' + encodeURIComponent(to.fullPath))
    }
})
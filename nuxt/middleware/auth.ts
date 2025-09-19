export default defineNuxtRouteMiddleware((to, from) => {
    // Skip authentication check during server-side rendering
    if (process.server) {
        return
    }
    
    // Check authentication only on client-side
    const isAuthenticated = () => {
        if (typeof window === 'undefined') return false
        return localStorage.getItem('jwt') !== '' && localStorage.getItem('jwt') !== null
    }

    if (!isAuthenticated()) {
        return navigateTo('/login')
    }
})
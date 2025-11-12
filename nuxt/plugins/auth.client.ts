export default defineNuxtPlugin(async () => {
    const { loggedIn, fetchMe } = useAuth()
    const cartStore = useCartStore()
    
    // Only fetch user data if not already logged in
    if (!loggedIn.value) {
        try {
            await fetchMe()
        } catch (error) {
            // User not authenticated, that's fine
            console.log('User not authenticated on page load')
            // Load guest cart from localStorage if user is not logged in
            cartStore.loadGuestCart()
        }
    }
})
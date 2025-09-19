export default defineNuxtPlugin(async () => {
    const { loggedIn, fetchMe } = useAuth()
    
    // Only fetch user data if not already logged in
    if (!loggedIn.value) {
        try {
            await fetchMe()
        } catch (error) {
            // User not authenticated, that's fine
            console.log('User not authenticated on page load')
        }
    }
})
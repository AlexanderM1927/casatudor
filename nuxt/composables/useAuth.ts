export const useAuth = () => {
    // Use a more descriptive key and ensure consistent state
    const user = useState<any | null>('auth.user', () => null)
    const loggedIn = computed(() => !!user.value)

    const fetchMe = async () => {
        try {
            const res: any = await $fetch('/api/auth/me')
            user.value = res.user
            return res.user
        } catch (error) {
            user.value = null
            throw error
        }
    }

    const login = async (identifier: string, password: string) => {
        try {
            const res: any = await $fetch('/api/auth/login', { 
                method: 'POST', 
                body: { identifier, password } 
            })
            user.value = res.user
            return res.user
        } catch (error) {
            user.value = null
            throw error
        }
    }

    const logout = async () => {
        try {
            await $fetch('/api/auth/logout', { method: 'POST' })
        } catch (error) {
            // Continue with logout even if server request fails
            console.error('Error during logout:', error)
        } finally {
            user.value = null
        }
    }

    return { user, loggedIn, fetchMe, login, logout }
}
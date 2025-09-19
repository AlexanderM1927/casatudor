export const useAuth = () => {
    const user = useState<any | null>('auth:user', () => null)
    const loggedIn = computed(() => !!user.value)

    const fetchMe = async () => {
        try {
            const res: any = await $fetch('/api/auth/me')
            user.value = res.user
        } catch {
            user.value = null
        }
    }

    const login = async (identifier: string, password: string) => {
        const res: any = await $fetch('/api/auth/login', { method: 'POST', body: { identifier, password } })
        user.value = res.user
    }

    const logout = async () => {
        await $fetch('/api/auth/logout', { method: 'POST' })
        user.value = null
    }

    return { user, loggedIn, fetchMe, login, logout }
}
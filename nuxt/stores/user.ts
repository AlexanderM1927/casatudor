export const useUserStore = defineStore('user', {
    state: () => {
        const user: User = {
            username: '',
            firstName: '',
            lastName: '',
            email: '',
            id: 0,
            logged: false
        }
        return {
            user
        }
    },
    actions: {
        setUser(user: User) {
            this.user = user
        },
        removeUser () {
            this.user = {
                username: '',
                firstName: '',
                lastName: '',
                email: '',
                id: 0,
                logged: false
            }
        }
    },
    getters: {
        getUser: (state) => {
            return state.user
        }
    }
  })
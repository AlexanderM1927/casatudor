<template>
    <div class="first-container center-container">
        <h2 class="title">Login</h2>
        <form @submit="login">
            <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Correo electrónico</label>
                <input v-model="email" type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
            </div>
            <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label">Clave</label>
                <input v-model="password" type="password" class="form-control" id="exampleInputPassword1">
            </div>
            <button @click="login" type="submit" class="btn ct-btn-success">Login</button>
            <br>
            No tienes una cuenta? <NuxtLink to="/register">Registrarme</NuxtLink>
        </form>
        <Notification :type="notificationType" :toast-id="'user-login'">
            {{ notificationMessage }}
        </Notification>
    </div>
</template>
<script setup lang="ts">
import ToastHelper from '~/helpers/ToastHelper';
import UserService from '~/services/UserService';

const userService = new UserService(useRuntimeConfig())

const router = useRouter()

const email: Ref<string> = ref('')
const password: Ref<string> = ref('')
const notificationType: Ref<string> = ref('')
const notificationMessage: Ref<string> = ref('')

const userState = useUserStore()


const login = async (e: Event) => {
    e.preventDefault()
    const user = {
        identifier: email.value,
        password: password.value
    }
    try {
        const res: any = await userService.login(user)
        if (res) {
            const { jwt, user } = res
            user.logged = true
            userState.setUser(user)
            localStorage.setItem('jwt', jwt)
            localStorage.setItem('userData', JSON.stringify(user))
            setTimeout(() => {
                router.push('/orders')
            }, 500)
        } else {
            notificationMessage.value = 'Unexpected error'
            notificationType.value = 'negative'
        }
    } catch (error: any) {
        notificationMessage.value = error.response._data.error.message
        notificationType.value = 'negative'
        ToastHelper.openToast('user-login')
    }
}
</script>
<style scoped>

</style>
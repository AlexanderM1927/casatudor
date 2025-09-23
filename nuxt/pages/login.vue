<template>
    <div class="first-container center-container bg-white">
        <h2 class="title">Login</h2>
        <form @submit="handleLogin">
            <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Correo electrónico</label>
                <input v-model="email" type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
            </div>
            <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label">Clave</label>
                <input v-model="password" type="password" class="form-control" id="exampleInputPassword1">
            </div>
            <button @click="handleLogin" type="submit" class="btn ct-btn-success">Login</button>
            <br>
            No tienes una cuenta? <NuxtLink to="/register">Registrarme</NuxtLink>
        </form>
    </div>
</template>
<script setup lang="ts">
import ToastHelper from '~/helpers/ToastHelper';
import texts from '@/config/texts.json'

const email: Ref<string> = ref('')
const password: Ref<string> = ref('')
const notificationType: Ref<string> = ref('')
const notificationMessage: Ref<string> = ref('')
const { login } = useAuth()


const handleLogin = async (e: Event) => {
    e.preventDefault()
    const user = {
        identifier: email.value,
        password: password.value
    }
    try {
        await login(user.identifier, user.password)
        navigateTo('/orders')
    } catch (error: any) {
        notificationMessage.value = texts.validate_information
        notificationType.value = 'error'
        ToastHelper.openToast(notificationMessage.value, notificationType.value)
    }
}
</script>
<style scoped>

</style>

<template>
    <div class="custom-container center-container">
        <h2>Register</h2>
        <form @submit.prevent="submit" preven>
            <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">First name</label>
                <input v-model="firstName" type="text" required class="form-control" aria-describedby="emailHelp">
                <div id="emailHelp" class="form-text">Ex: Juan</div>
            </div>
            <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Last name</label>
                <input v-model="lastName" type="text" required class="form-control" aria-describedby="emailHelp">
                <div id="emailHelp" class="form-text">Ex: Martinez</div>
            </div>
            <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">User name</label>
                <input v-model="username" type="text" required class="form-control" aria-describedby="emailHelp">
                <div id="emailHelp" class="form-text">Ex: JuanMartinez19</div>
            </div>
            <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Email address</label>
                <input v-model="email" type="email" required class="form-control" aria-describedby="emailHelp">
                <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div class="mb-3">
                <label for="exampleInputPassword1" required class="form-label">Password</label>
                <input v-model="password" type="password" class="form-control" id="exampleInputPassword1">
            </div>
            <button type="submit" @click="submit" class="btn btn-success">Register</button>
        </form>
        <Notification :type="notificationType" :toast-id="'user-created'">
            {{ notificationMessage }}
        </Notification>
    </div>
</template>
<script setup lang="ts">
import ToastHelper from '~/helpers/ToastHelper';
import UserService from '~/services/UserService';

const userService = new UserService(useRuntimeConfig())

const router = useRouter()

const username: Ref<string> = ref('')
const firstName: Ref<string> = ref('')
const lastName: Ref<string> = ref('')
const email: Ref<string> = ref('')
const password: Ref<string> = ref('')
const notificationType: Ref<string> = ref('')
const notificationMessage: Ref<string> = ref('')

const submit = async (e: Event) => {
    e.preventDefault()
    const user = {
        username: username.value,
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value
    }
    try {
        notificationType.value = 'positive'
        notificationMessage.value = 'User created'
        await userService.createUser(user)
        ToastHelper.openToast('user-created')
        setTimeout(() => {
            router.push('/login')
        }, 500)
    } catch (error) {
        notificationMessage.value = error.response._data.error.message
        notificationType.value = 'negative'
        ToastHelper.openToast('user-created')
    }
}
</script>
<style scoped>

</style>
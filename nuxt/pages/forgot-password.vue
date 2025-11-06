<template>
    <div class="first-container center-container bg-white">
        <h2 class="title">Recuperar Contraseña</h2>
        <p>Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>
        
        <form v-if="!emailSent" @submit="handleForgotPassword">
            <div class="mb-3">
                <label for="emailInput" class="form-label">Correo electrónico</label>
                <input 
                    v-model="email" 
                    type="email" 
                    class="form-control" 
                    id="emailInput" 
                    placeholder="tu@email.com"
                    required
                >
            </div>
            <button 
                type="submit" 
                class="btn ct-btn-success"
                :disabled="loading"
            >
                {{ loading ? 'Enviando...' : 'Recuperar cuenta' }}
            </button>
            <br><br>
            <NuxtLink to="/login">Volver al login</NuxtLink>
        </form>

        <div v-else class="success-message">
            <div class="success-icon">✓</div>
            <h3>¡Correo enviado!</h3>
            <p>
                Si existe una cuenta asociada a <strong>{{ email }}</strong>, 
                recibirás un correo con las instrucciones para restablecer tu contraseña.
            </p>
            <p class="info-text">
                Por favor, revisa tu bandeja de entrada y spam. El enlace expirará en 1 hora.
            </p>
            <NuxtLink to="/login" class="btn ct-btn-success">Volver al login</NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import ToastHelper from '~/helpers/ToastHelper';
import UserService from '@/services/UserService';

const config = useRuntimeConfig()
const userService = new UserService(config)

const email = ref('')
const loading = ref(false)
const emailSent = ref(false)

const handleForgotPassword = async (e: Event) => {
    e.preventDefault()
    
    if (!email.value) {
        ToastHelper.openToast('Por favor ingresa tu correo electrónico', 'error')
        return
    }

    loading.value = true
    
    try {
        await userService.forgotPassword(email.value)
        emailSent.value = true
        ToastHelper.openToast('Correo de recuperación enviado', 'success')
    } catch (error: any) {
        console.error('Error en forgot password:', error)
        ToastHelper.openToast('Error al enviar el correo. Por favor intenta nuevamente.', 'error')
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.title {
    margin-bottom: 0.5rem;
}

.subtitle {
    color: #6b7280;
    margin-bottom: 2rem;
}

.success-message {
    text-align: center;
    padding: 2rem 0;
}

.success-icon {
    width: 60px;
    height: 60px;
    background: #10b981;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: bold;
    margin: 0 auto 1.5rem;
}

.success-message h3 {
    color: #111827;
    margin-bottom: 1rem;
}

.success-message p {
    color: #6b7280;
    margin-bottom: 1rem;
}

.info-text {
    font-size: 0.9rem;
    color: #9ca3af;
    margin-bottom: 2rem;
}

button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
</style>

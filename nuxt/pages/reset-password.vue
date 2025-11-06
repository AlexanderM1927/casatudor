<template>
    <div class="first-container center-container bg-white">
        <h2 class="title">Restablecer Contraseña</h2>
        
        <form v-if="!passwordReset" @submit="handleResetPassword">
            <div class="mb-3">
                <label for="passwordInput" class="form-label">Nueva Contraseña</label>
                <input 
                    v-model="password" 
                    type="password" 
                    class="form-control" 
                    id="passwordInput" 
                    placeholder="Mínimo 6 caracteres"
                    minlength="6"
                    required
                >
            </div>
            <div class="mb-3">
                <label for="passwordConfirmInput" class="form-label">Confirmar Contraseña</label>
                <input 
                    v-model="passwordConfirmation" 
                    type="password" 
                    class="form-control" 
                    id="passwordConfirmInput" 
                    placeholder="Repite tu contraseña"
                    minlength="6"
                    required
                >
            </div>
            <button 
                type="submit" 
                class="btn ct-btn-success"
                :disabled="loading"
            >
                {{ loading ? 'Actualizando...' : 'Restablecer Contraseña' }}
            </button>
            <br><br>
            <NuxtLink to="/login">Volver al login</NuxtLink>
        </form>

        <div v-else class="success-message">
            <div class="success-icon">✓</div>
            <h3>¡Contraseña actualizada!</h3>
            <p>
                Tu contraseña ha sido restablecida exitosamente.
            </p>
            <p class="info-text">
                Ya puedes iniciar sesión con tu nueva contraseña.
            </p>
            <NuxtLink to="/login" class="btn ct-btn-success">Ir al login</NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import ToastHelper from '~/helpers/ToastHelper';
import UserService from '@/services/UserService';

const config = useRuntimeConfig()
const userService = new UserService(config)
const route = useRoute()
const router = useRouter()

const code = ref(route.query.code as string || '')
const password = ref('')
const passwordConfirmation = ref('')
const loading = ref(false)
const passwordReset = ref(false)

// Check if code is present
onMounted(() => {
    if (!code.value) {
        ToastHelper.openToast('Código de recuperación no válido', 'error')
        router.push('/forgot-password')
    }
})

const handleResetPassword = async (e: Event) => {
    e.preventDefault()
    
    if (!password.value || !passwordConfirmation.value) {
        ToastHelper.openToast('Por favor completa todos los campos', 'error')
        return
    }

    if (password.value !== passwordConfirmation.value) {
        ToastHelper.openToast('Las contraseñas no coinciden', 'error')
        return
    }

    if (password.value.length < 6) {
        ToastHelper.openToast('La contraseña debe tener al menos 6 caracteres', 'error')
        return
    }

    loading.value = true
    
    try {
        await userService.resetPassword(code.value, password.value, passwordConfirmation.value)
        passwordReset.value = true
        ToastHelper.openToast('Contraseña actualizada correctamente', 'success')
    } catch (error: any) {
        console.error('Error en reset password:', error)
        const errorMessage = error?.data?.error?.message || 'Error al restablecer la contraseña'
        ToastHelper.openToast(errorMessage, 'error')
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

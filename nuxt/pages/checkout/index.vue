<template>
    <div class="first-container bg-white min-h-screen">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Checkout Form -->
            <div class="order-2 lg:order-1">
                <h1 class="text-2xl font-bold mb-6">Información de Envío</h1>
                
                <form @submit.prevent="handleSubmit" class="space-y-6">
                    <!-- Contact Information -->
                    <div class="bg-gray-50 p-6 rounded-lg">
                        <h2 class="text-lg font-semibold mb-4">Información de Contacto</h2>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                                    Correo Electrónico de Factura *
                                </label>
                                <input
                                    id="email"
                                    v-model="formData.email"
                                    type="email"
                                    required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="correo@ejemplo.com"
                                />
                            </div>
                            
                            <div>
                                <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                                    Número de Celular *
                                </label>
                                <input
                                    id="phone"
                                    v-model="formData.phone"
                                    type="tel"
                                    required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="+57 300 123 4567"
                                />
                            </div>
                            
                            <div class="md:col-span-2">
                                <label for="identify" class="block text-sm font-medium text-gray-700 mb-2">
                                    Número de Identificación *
                                </label>
                                <input
                                    id="identify"
                                    v-model="formData.identify"
                                    type="text"
                                    required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Cédula, NIT, pasaporte, etc."
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Shipping Address -->
                    <div class="bg-gray-50 p-6 rounded-lg">
                        <h2 class="text-lg font-semibold mb-4">Dirección de Envío</h2>
                        
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <!-- Country -->
                            <div>
                                <label for="country" class="block text-sm font-medium text-gray-700 mb-2">
                                    País *
                                </label>
                                <select
                                    id="country"
                                    v-model="formData.country"
                                    @change="onCountryChange"
                                    required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Seleccionar país</option>
                                    <option v-for="country in countries" :key="country.id" :value="country.id">
                                        {{ country.name }}
                                    </option>
                                </select>
                            </div>

                            <!-- Department -->
                            <div>
                                <label for="department" class="block text-sm font-medium text-gray-700 mb-2">
                                    Departamento *
                                </label>
                                <select
                                    id="department"
                                    v-model="formData.department"
                                    @change="onDepartmentChange"
                                    :disabled="!formData.country"
                                    required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                                >
                                    <option value="">Seleccionar departamento</option>
                                    <option v-for="department in departments" :key="department.id" :value="department.id">
                                        {{ department.name }}
                                    </option>
                                </select>
                            </div>

                            <!-- City -->
                            <div>
                                <label for="city" class="block text-sm font-medium text-gray-700 mb-2">
                                    Ciudad *
                                </label>
                                <select
                                    id="city"
                                    v-model="formData.city"
                                    :disabled="!formData.department"
                                    required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                                >
                                    <option value="">Seleccionar ciudad</option>
                                    <option v-for="city in cities" :key="city.id" :value="city.id">
                                        {{ city.name }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div class="space-y-4">
                            <div>
                                <label for="address1" class="block text-sm font-medium text-gray-700 mb-2">
                                    Dirección de Envío 1 *
                                </label>
                                <input
                                    id="address1"
                                    v-model="formData.address1"
                                    type="text"
                                    required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Calle, carrera, número"
                                />
                            </div>

                            <div>
                                <label for="addressDetails" class="block text-sm font-medium text-gray-700 mb-2">
                                    Detalles Adicionales de Dirección
                                </label>
                                <textarea
                                    id="addressDetails"
                                    v-model="formData.addressDetails"
                                    rows="3"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Apartamento, piso, referencias, instrucciones especiales..."
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <div class="flex justify-end">
                        <button
                            type="submit"
                            :disabled="!isFormValid || isSubmitting"
                            :class="`px-8 py-3 ${isFormValid && !isSubmitting ? 'bg-theme-primary' : 'bg-gray-400'} text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors`"
                        >
                            {{ isSubmitting ? 'Procesando...' : 'Continuar al Pago' }}
                        </button>
                    </div>
                </form>
            </div>

            <!-- Order Summary -->
            <div class="order-1 lg:order-2">
                <div class="bg-gray-50 p-6 rounded-lg sticky top-4">
                    <h2 class="text-lg font-semibold mb-4">Resumen del Pedido</h2>
                    
                    <!-- Cart Items -->
                    <div class="space-y-4 mb-6">
                        <div
                            v-for="product in cartProducts"
                            :key="`${product.id}-${product.selectedVariants?.color}-${product.selectedVariants?.size}`"
                            class="flex items-center space-x-4 p-3 bg-white rounded-md"
                        >
                            <NuxtImg
                                :src="product.images[0]"
                                :alt="product.name"
                                class="w-16 h-16 object-cover rounded-md"
                            />
                            <div class="flex-1">
                                <h5 class="font-medium card-item__title">{{ product.name }}</h5>
                                <p class="text-sm text-gray-500">
                                    {{ product.selectedVariants?.color }} / {{ product.selectedVariants?.size }}
                                </p>
                                <p class="text-sm text-gray-500">Cantidad: {{ product.quantity }}</p>
                            </div>
                            <div class="text-right">
                                <p class="font-semibold text-gray-900">
                                    ${{ (product.price * product.quantity).toLocaleString() }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Price Summary -->
                    <div class="border-t pt-4 space-y-2">
                        <div class="flex justify-between text-sm">
                            <span>Subtotal:</span>
                            <span>${{ (subtotal - tax).toLocaleString() }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span>Envío:</span>
                            <span>{{ shipping > 0 ? `$${shipping.toLocaleString()}` : 'Al recibir tu producto cancelas el envío' }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span>IVA:</span>
                            <span>${{ tax.toLocaleString() }}</span>
                        </div>
                        <div class="flex justify-between text-lg font-semibold border-t pt-2">
                            <span>Total:</span>
                            <span>${{ total.toLocaleString() }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import PaymentService from '~/services/PaymentService'
import texts from '~/config/texts.json'
import ToastHelper from '~/helpers/ToastHelper'
definePageMeta({ middleware: 'auth', requiresAuth: true })

const cartStore = useCartStore()
const { user } = useAuth()
const config = useRuntimeConfig()
const paymentService = new PaymentService(config)

// Form data
const formData = ref({
    email: user.value?.email || '',
    phone: '',
    identify: '',
    country: '',
    department: '',
    city: '',
    address1: '',
    addressDetails: ''
})

// Location data
const countries = ref([])
const departments = ref([])
const cities = ref([])

// Loading states
const isSubmitting = ref(false)

// Get cart products
const cartProducts = computed(() => cartStore.getProductsCart)
const cartId = computed(() => cartStore.id)

// Calculate totals
const subtotal = computed(() => {
    return cartProducts.value.reduce((total, product) => {
        return total + (product.price * product.quantity)
    }, 0)
})

const shipping = computed(() => {
    // Calculate shipping based on location or order value
    // return subtotal.value > 100000 ? 0 : 15000
    return 0
})

const tax = computed(() => {
    return Math.round(subtotal.value * 0.19) // 19% IVA
})

const total = computed(() => {
    return subtotal.value + shipping.value
})

// Form validation
const isFormValid = computed(() => {
    return formData.value.email &&
           formData.value.phone &&
           formData.value.identify &&
           formData.value.country &&
           formData.value.department &&
           formData.value.city &&
           formData.value.address1
})

// Load countries on mount
onMounted(async () => {
    try {
        countries.value = await $fetch('/api/locations/countries')
    } catch (error) {
        console.error('Error loading countries:', error)
    }
})

// Handle country change
const onCountryChange = async () => {
    formData.value.department = ''
    formData.value.city = ''
    departments.value = []
    cities.value = []
    
    if (formData.value.country) {
        try {
            departments.value = await $fetch(`/api/locations/departments?countryId=${formData.value.country}`)
        } catch (error) {
            console.error('Error loading departments:', error)
        }
    }
}

// Handle department change
const onDepartmentChange = async () => {
    formData.value.city = ''
    cities.value = []
    
    if (formData.value.department) {
        try {
            cities.value = await $fetch(`/api/locations/cities?departmentId=${formData.value.department}`)
        } catch (error) {
            console.error('Error loading cities:', error)
        }
    }
}

const getCityById = (id: any) => {
    return cities.value.find(city => city.id === id)?.name || ''
}
const getDepartmentById = (id: any) => {
    return departments.value.find(dept => dept.id === id)?.name || ''
}
const getCountryById = (id: any) => {
    return countries.value.find(country => country.id === id)?.name || ''
}

// Handle form submission
const handleSubmit = async () => {
    if (!isFormValid.value) return
    
    isSubmitting.value = true
    
    try {
        const orderData = {
            user: user.value.id,
            email: formData.value.email,
            phone: formData.value.phone,
            identify: formData.value.identify,
            shippingAddress: {
                country: getCountryById(formData.value.country),
                department: getDepartmentById(formData.value.department),
                city: getCityById(formData.value.city),
                address1: formData.value.address1,
                addressDetails: formData.value.addressDetails
            },
            cartId: cartId.value
        }
        
        await processPayment(orderData)
        
    } catch (error) {
        console.error('Error creating order:', error)
        // Show error message to user
    } finally {
        isSubmitting.value = false
    }
}

const processPayment = (async (data: any) => {
    const payment: any = await paymentService.processPayment(data)
    const initCheckout = {
        currency: payment?.currency,
        amountInCents: payment?.amountInCents,
        reference: `${payment?.reference}`,
        publicKey: payment?.publicKey,
        redirectUrl: payment?.redirectUrl,
        signature: payment?.signature
    }
    const checkout: any = new WidgetCheckout(initCheckout)
    checkout.open(function (result: any) {
        if (result.transaction.status === "APPROVED") {
            ToastHelper.openToast(texts.payments.approved, "success");
            cartStore.clearCart()
            cartStore.syncCartWithStrapi()
            location.href = payment?.redirectUrl
        } else if (result.transaction.status === "DECLINED") {
            ToastHelper.openToast(texts.payments.declined, "error");
        } else if (result.transaction.status === "PENDING") {
            ToastHelper.openToast(texts.payments.pending, "warning");
        }
    });
})
</script>
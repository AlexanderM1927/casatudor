<template>
    <div class="cart-content bg-gray-50" ref="cartContent">
        <div class="cart-content__container">
            <div class="cart-content-header">
                <h2 class="title">{{ texts.cart.title }}</h2>
                <div class="close-btn">
                    <Icon name="material-symbols:close" @click="closeCart()" />
                </div>
            </div>
            
            <!-- Scrollable content area -->
            <div class="cart-content-body">
                <div class="cart-content-items">
                    <ProductCart
                        v-for="(product, index) in cartProducts"
                        :key="index"
                        :product="product"
                    ></ProductCart>
                </div>
            </div>

            <!-- Fixed button at bottom -->
            <div class="cart-content-footer" v-show="cartProducts.length > 0">
                <button 
                    :title="texts.cart.proceed" 
                    class="btn btn-primary w-100"
                    @click="proceedPurchase"
                >
                    {{ texts.cart.proceed }}
                </button>
                <button 
                    :title="texts.cart.proceed" 
                    class="btn btn-success w-100"
                    @click="purchaseByWhatsapp"
                >
                    <Icon name="mdi:whatsapp" />
                    {{ texts.buy_on_whatsapp }}
                </button>
            </div>
        </div>
    </div>
    <div id="overlay" @click="closeCart()"></div>
</template>
<script setup lang="ts">
import texts from '@/config/texts.json'
import CartService from '~/services/CartService';
import ToastHelper from '~/helpers/ToastHelper'

const { user } = useAuth()
const config = useRuntimeConfig()
const emit = defineEmits(['closeCart'])
const cart = useCartStore()
const cartContent: Ref<HTMLDivElement | undefined> = ref()
const notificationType: Ref<string> = ref("");
const notificationMessage: Ref<string> = ref("");
const props = defineProps({
    isCartOpen: {
        required: true,
        type: Boolean
    },
    data: {
        type: Object
    }
})

watch(() => props.isCartOpen, (val) => {
    if (val === true) {
        openCartHTML()
    } else {
        closeCartHTML()
    }
})

const cartStoreComputed = storeToRefs(cart)
const cartProducts = cartStoreComputed.getProductsCart

const closeCartHTML = (() => {
    const overlayItem = document.getElementById("overlay")
    if (overlayItem) overlayItem.style.display = "none";
    if (cartContent.value) {
        cartContent.value.style.opacity = '0'
        cartContent.value.style.visibility = 'hidden'
    }
})

const openCartHTML = (() => {
    const overlayItem = document.getElementById("overlay")
    if (overlayItem) overlayItem.style.display = "block";
    if (cartContent.value) {
        cartContent.value.style.opacity = '1'
        cartContent.value.style.visibility = 'visible'
    }
})

const closeCart = (() => {
    emit('closeCart')
})

const purchaseByWhatsapp = (() => {
    let listOfProducts = '¡Hola!,%20estoy%20interesado%20en%20comprar%20estos%20productos:%0A'
    for (let i = 0; i < cartProducts.value.length; i++) {
        const element = cartProducts.value[i]
        const productName = element.name
        const quantity = element.quantity
        const color = element?.selectedVariants?.color
        const size = element?.selectedVariants?.size
        listOfProducts += `${productName} ${color ? '- Color: ' + color : ''} ${size ? '- Talla: ' + size : ''} - Cantidad: ${quantity}`
        listOfProducts += `,%20 %0A`
    }
    window.open(`https://wa.me/${props?.data?.whatsappPhone}?text=${listOfProducts}`)
})

const proceedPurchase = (() => {
    if (!user.value) {
        closeCart()
        navigateTo('/login')
        ToastHelper.openToast('Tienes que iniciar sesión antes de comprar', 'warning')
    } else {
        processPurchaseByWompi()
    }
})

onMounted(() => {
    cart.getUserCart()
})

watch(user, (newUser) => {
    if (newUser) {
        cart.getUserCart()
    }
})

//TODO: Get cart from backend if not exists and user is logged in

const processPurchaseByWompi = (async () => {
    try {
        //TODO: Creates a Cart if the cart is not defined
        navigateTo('/checkout')
        closeCart()
        // const cartResponse: any = await cartService.createCart({
        //     data: {
        //         users_permissions_user: user?.value?.id,
        //         products: cartProducts.value.map((product: IProductCart) => {
        //             return {
        //                 product: product.id,
        //                 quantity: product.quantity,
        //                 selectedVariants: {
        //                     color: product?.selectedVariants?.color,
        //                     size: product?.selectedVariants?.size
        //                 }
        //             }
        //         })
        //     }
        // })
        // const cart: ICart = cartResponse.data
        
    } catch (error: any) {
        if (error) {
            notificationMessage.value = error.response._data.error.message;
        } else {
            notificationMessage.value = "Unexpected error appears";
        }
        notificationType.value = "negative";
        ToastHelper.openToast(notificationMessage.value, notificationType.value);
    }
})
</script>

<style lang="scss" scoped>
#overlay {
  position: fixed;
  display: none;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  z-index: 4;
  cursor: pointer;
  overflow-y: auto;
}

.cart-content {
    position: fixed;
    top: 0;
    width: 30%;
    right: 0;
    height: 100vh;
    color: $themeColorText;
    visibility: hidden;
    opacity: 0;
    z-index: 5;
    transition: visibility 0s, opacity 0.5s linear;
    display: flex;
    flex-direction: column;
}

.cart-content h2 {
    margin-bottom: 0;
}

@media only screen and (max-width: $grid-breakpoints-sm) {
    .cart-content {
        width: 100%;
    }
}

.cart-content__container {
    display: flex;
    flex-direction: column;
    height: 100dvh;
    padding: 1rem;
}

.cart-content-header {
    flex-shrink: 0; /* Don't shrink */
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid $themeColorText;
}

.cart-content-body {
    flex: 1; /* Take up remaining space */
    overflow: hidden; /* Prevent overflow */
    display: flex;
    flex-direction: column;
    min-height: 0; /* Important for flex children with overflow */
}

.cart-content-items {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 1rem 0;
    
    /* Custom scrollbar styling */
    &::-webkit-scrollbar {
        width: 6px;
    }
    
    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 3px;
        
        &:hover {
            background: #a8a8a8;
        }
    }
}

.cart-content-footer {
    flex-shrink: 0; /* Don't shrink */
    padding-top: 1rem;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    
    button {
        width: 100%;
        padding: 1rem;
        font-weight: 600;
        border-radius: 8px;
        transition: all 0.2s ease;
        
        &:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
    }
}

.close-btn {
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: background-color 0.2s ease;
    
    &:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }
}

.cart-content h1 {
    font-family: 'Inter';
    font-size: 3rem;
    font-weight: 700;
}

/* Empty cart state */
.cart-content-items:empty::after {
    content: 'Tu carrito está vacío';
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #666;
    font-style: italic;
}

/* Responsive improvements */
@media only screen and (max-width: $grid-breakpoints-sm) {
    .cart-content__container {
        padding: 0.75rem;
    }
    
    .cart-content-items {
        padding: 0.75rem 0;
    }
    
    .cart-content-footer button {
        padding: 0.875rem;
        font-size: 0.9rem;
    }
}

@media only screen and (max-width: 480px) {
    .cart-content__container {
        padding: 0.5rem;
    }
    
    .cart-content-header {
        padding-bottom: 0.75rem;
    }
    
    .cart-content-items {
        padding: 0.5rem 0;
    }
    
    .cart-content-footer {
        padding-top: 0.75rem;
    }
}
</style>
<template>
    <div class="cart-content" ref="cartContent">
        <div class="cart-content__container">
            <div class="cart-content-header">
                <h2 class="title">{{ texts.cart.title }}</h2>
                <div class="close-btn">
                    <Icon name="material-symbols:close" @click="closeCart()" />
                </div>
            </div>
            <div class="cart-content-items">
                <div class="row">
                    <ProductCart
                        v-for="(product, index) in cartProducts"
                        :key="index"
                        :product="product"
                        :childClass="`col-12`"
                    ></ProductCart>
                </div>
            </div>
            <button 
                :title="texts.cart.proceed" 
                class="btn btn-success w-100"
                @click="proceedPurchase"
            >
                {{ texts.cart.proceed }}
            </button>
        </div>
    </div>
    <div id="overlay" @click="closeCart()"></div>
</template>
<script setup lang="ts">
import texts from '@/config/texts.json'
import CartService from '~/services/CartService';
import ToastHelper from '~/helpers/ToastHelper'
import PaymentService from '~/services/PaymentService'

const { user } = useAuth()
const cartService = new CartService(useRuntimeConfig())
const paymentService = new PaymentService(useRuntimeConfig())
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

//TODO: Get cart from backend if not exists and user is logged in

const processPurchaseByWompi = (async () => {
    try {
        //TODO: Creates a Cart if the cart is not defined
        const cartResponse: any = await cartService.createCart({
            data: {
                users_permissions_user: user?.value?.id,
                products: cartProducts.value.map((product: IProductCart) => {
                    return {
                        product: product.id,
                        quantity: product.quantity,
                        selectedVariants: {
                            color: product?.selectedVariants?.color,
                            size: product?.selectedVariants?.size
                        }
                    }
                })
            }
        })
        const cart: ICart = cartResponse.data
        const payment: any = await paymentService.processPayment({
            cartId: cart?.id
        })
        const initCheckout = {
            currency: payment?.currency,
            amountInCents: payment?.amountInCents,
            reference: `${payment?.reference}_INVOICE`,
            publicKey: payment?.publicKey,
            redirectUrl: payment?.redirectUrl,
            signature: payment?.signature
        }
        const checkout: any = new WidgetCheckout(initCheckout)
        checkout.open(function (result: any) {
            if (result.transaction.status === "APPROVED") {
                notificationMessage.value = "¡Pago aprobado! Gracias por su compra.";
                notificationType.value = "success";
                ToastHelper.openToast(notificationMessage.value, notificationType.value);
                closeCart()
                location.href = payment?.redirectUrl
            } else if (result.transaction.status === "DECLINED") {
                notificationMessage.value = "El pago fue rechazado, por favor intente nuevamente.";
                notificationType.value = "error";
                ToastHelper.openToast(notificationMessage.value, notificationType.value);
            } else if (result.transaction.status === "PENDING") {
                notificationMessage.value = "El pago está pendiente, por favor revise su método de pago.";
                notificationType.value = "warning";
                ToastHelper.openToast(notificationMessage.value, notificationType.value);
            }
            //TODO: Implement this
            // cleanCart()
            console.log(result.transaction);
        });
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
  position: fixed; /* Sit on top of the page content */
  display: none; /* Hidden by default */
  width: 100%; /* Full width (cover the whole page) */
  height: 100%; /* Full height (cover the whole page) */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5); /* Black background with opacity */
  z-index: 4; /* Specify a stack order in case you're using a different order for other elements */
  cursor: pointer; /* Add a pointer on hover */
  overflow-y: auto;
}

.cart-content {
    position: fixed;
    top: 0;
    width: 30%;
    right: 0;
    height: 100vh;
    background: $themeBackground;
    color: $themeColorText;
    visibility: hidden;
    opacity: 0;
    padding: 1rem;
    z-index: 5;
    transition: visibility 0s, opacity 0.5s linear;
}

.cart-content h2 {
    margin-bottom: 0;
}

@media only screen and (max-width: $grid-breakpoints-sm) {
    .cart-content {
        width: 100%;
    }
}
.cart-content-header {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid $themeColorText;
}

.cart-content h1 {
    font-family: 'Inter';
    font-size: 3rem;
    font-weight: 700;
}

.cart-content-items {
    overflow-y: auto;
    overflow-x: hidden;
    height: 80%;
}

.close-btn {
    cursor: pointer;
}

.cart-content__container {
    position: relative;
    height: 100%;
}

.cart-content__container button {
    position: absolute;
    bottom: 10%;
}
</style>

<template>
    <div class="cart-content" ref="cartContent">
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
            title="Proceder al pago" 
            class="add-cart-btn btn btn-success w-100"
            @click="proceedPurchase"
        >
            {{ texts.cart.proceed }}
        </button>
    </div>
    <div id="overlay" @click="closeCart()"></div>
</template>
<script setup lang="ts">
import texts from '@/config/texts.json'
const emit = defineEmits(['closeCart'])
const cart = useCartStore()
const cartContent: Ref<HTMLDivElement | undefined> = ref()

const props = defineProps({
    isCartOpen: {
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
        listOfProducts += `${productName} - Cantidad: ${quantity}`
        listOfProducts += `,%20 %0A`
    }
    window.open(`https://wa.me/${props.data.whatsappPhone}?text=${listOfProducts}`)
})

const proceedPurchase = (() => {
    purchaseByWhatsapp()
})
</script>

<style lang="scss" scoped>
@import "@/styles/_colors.scss";
@import "@/styles/_breakpoints.scss";
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
    font-family: 'contra-slab-bold';
    font-size: 3rem;
}

.cart-content-items {
    overflow-y: auto;
    overflow-x: hidden;
    height: 70%;
}

.close-btn {
    cursor: pointer;
}
</style>
<template>
    <div :class="`card ${childClass}`">
        <div class="card-body cart-item">
            <h5 class="card-title">{{ product.name }}</h5>
            <p>Cantidad: {{ product.quantity }}</p>
            <a title="Remover del carrito" class="add-cart-btn btn btn-danger" @click="removeFromCart(product)">
                Quitar
            </a>
        </div>
    </div>
    <Notification type="info" :toast-id="'product-cart-' + product.id">
        Item removed
    </Notification>
</template>
<script setup lang="ts">
import type { PropType } from 'vue';
import ToastHelper from '~/helpers/ToastHelper';
const cart = useCartStore()
const props = defineProps({
    childClass: String,
    product: {
        type: Object as PropType<ProductCart>,
        required: true
    }
})

const removeFromCart = ((product: ProductCart) => {
    ToastHelper.openToast('product-cart-' + product.id)
    setTimeout(() => {
        cart.removeProducts(product)
    }, 500)
})
</script>

<style scoped>
.cart-item {
    display: flex;
    justify-content: space-between;
}
</style>
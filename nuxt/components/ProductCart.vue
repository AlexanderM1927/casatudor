<template>
    <div :class="`card ${childClass}`">
        <div class="card-body cart-item">
            <h5 class="card-title">{{ product.name }}</h5>
            <p>Quantity: {{ product.quantity }}</p>
            <a class="add-cart-btn btn btn-danger" @click="removeFromCart(product)">
                Remove
            </a>
        </div>
    </div>
    <Notification type="info" :toast-id="'product-cart-' + product.id">
        Item removed
    </Notification>
</template>
<script setup lang="ts">
import ToastHelper from '~/helpers/ToastHelper';
const cart = useCartStore()
const props = defineProps({
    childClass: String,
    product: {
        type: Object,
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
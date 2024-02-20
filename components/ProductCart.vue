<template>
    <div :class="`card ${childClass}`">
        <div class="card-body cart-item">
            <h5 class="card-title">{{ product.name }}</h5>
            <a class="add-cart-btn btn btn-danger" @click="removeFromCart(idItem)">
                Remove
            </a>
        </div>
    </div>
    <Notification type="negative" :toast-id="idItem">
        Item removed
    </Notification>
</template>
<script setup lang="ts">
import ToastHelper from '~/helpers/ToastHelper';
const props = defineProps({
    childClass: String,
    product: Object
})
const idItem = 'product-cart-' + 123

const removeFromCart = ((id: String) => {
    ToastHelper.openToast(id)
})
</script>

<style scoped>
.cart-item {
    display: flex;
    justify-content: space-between;
}
</style>
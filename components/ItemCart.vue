<template>
    <div :class="`card ${childClass}`">
        <div class="card-body cart-item">
            <h5 class="card-title">Card title</h5>
            <a class="add-cart-btn btn btn-danger" @click="removeFromCart(idItem)">
                Remove
            </a>
        </div>
    </div>
    <Notification type="negative" :toast-id="idItem">
        Item removed
    </Notification>
</template>
<script setup>
import ToastHelper from '~/helpers/ToastHelper';
const props = defineProps(['childClass'])
const idItem = 'product-cart-' + 123

const removeFromCart = ((id) => {
    ToastHelper.openToast(id)
})
</script>

<style scoped>
.cart-item {
    display: flex;
    justify-content: space-between;
}
</style>
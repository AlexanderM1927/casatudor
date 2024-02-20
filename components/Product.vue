<template>
    <div :class="`card ${childClass}`">
        <img :src="product.image" class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">{{ product.name }}</h5>
            <a class="add-cart-btn btn btn-outline-primary" @click="addToCart(idItem)">
                Add to cart
                <Icon name="material-symbols:add-shopping-cart" />
            </a>
        </div>
    </div>
    <Notification type="positive" :toast-id="idItem">
        Item added to cart
    </Notification>
</template>
<script setup lang="ts">
import ToastHelper from '~/helpers/ToastHelper';
const props = defineProps({
    childClass: String,
    product: {
        type: Object,
        required: true
    }
})
const idItem = 'product-' + 123

const addToCart = ((id: String) => {
    ToastHelper.openToast(id)
})
</script>

<style scoped>
.add-cart-btn {
    display: flex;
    align-items: center;
    vertical-align: middle;
    justify-content: space-between;
}
</style>
<template>
    <div :class="`card ${childClass}`">
        <img :src="product.image" class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">{{ product.name }}</h5>
            <p>${{ formatMiles(product.price) }}</p>
            <a class="add-cart-btn btn btn-outline-primary" @click="addToCart(product)">
                Add to cart
                <Icon name="material-symbols:add-shopping-cart" />
            </a>
        </div>
    </div>
    <Notification type="positive" :toast-id="'product-' + product.id">
        Item added to cart
    </Notification>
</template>
<script setup lang="ts">
import NumberHelper from '~/helpers/NumberHelper';
const cart = useCartStore()

const formatMiles = NumberHelper.miles
import ToastHelper from '~/helpers/ToastHelper';
const props = defineProps({
    childClass: String,
    product: {
        type: Object,
        required: true
    }
})

const addToCart = ((product: Product) => {
    ToastHelper.openToast('product-' + product.id)
    const productCart: ProductCart = {
        ...product,
        quantity: 1
    }
    cart.addProducts(productCart)
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
<template>
    <div v-if="product" :class="`card ${childClass}`">
        <img :src="product.image" class="card-img-top product__img" alt="...">
        <div class="card-body">
            <h5 class="card-title">{{ product.name }}</h5>
            <p>${{ formatMiles(product.price) }}</p>
            <div class="product__btns">
                <a title="Agregar al carrito" class="add-cart-btn btn btn-outline-primary" @click="addToCart(product)">
                    <Icon name="material-symbols:add-shopping-cart" />
                </a>
                <a title="Agregar a favoritos" class="add-cart-btn btn btn-outline-danger" @click="addToCart(product)">
                    <Icon name="material-symbols:favorite" />
                </a>
            </div>
        </div>
    </div>
    <Notification v-if="product" type="positive" :toast-id="'product-' + product.id">
        Item added to cart
    </Notification>
</template>
<script setup lang="ts">
import type { PropType } from 'vue';
import NumberHelper from '~/helpers/NumberHelper';
const cart = useCartStore()

const formatMiles = NumberHelper.miles
import ToastHelper from '~/helpers/ToastHelper';

const props = defineProps({
    childClass: {
        type: String as PropType<String>
    },
    product: {
        type: Object as PropType<Product>
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

.product__img {
    width: 100%;
    height: 10rem;
}

.product__btns {
    display: flex;
    justify-content: space-between;
}
</style>
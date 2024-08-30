<template>
    <div :class="`product-cart-card card ${childClass}`">
        <div class="card-body cart-item">
            <img :title="product.name" :src="product.image" alt="{{ product.name }}">
            <div class="cart-item__info">
                <h5 class="cad-item__title">{{ product.name }}</h5>
                <p>{{ texts.cart.quantity }}: {{ product.quantity }}</p>
                <div class="cad-item__price">
                    <p>{{ texts.cart.price }}: {{ formatMiles(product.price) }}</p>
                    <p>{{ texts.cart.total }}: {{ formatMiles((product.price * product.quantity)) }}</p>
                </div>
            </div>
        </div>
        <a title="Remover del carrito" class="add-cart-btn btn btn-danger" @click="removeFromCart(product)">
            {{ texts.cart.remove }}
        </a>
    </div>
    <Notification type="info" :toast-id="'product-cart-' + product.id">
        {{ texts.item_removed }}
    </Notification>
</template>
<script setup lang="ts">
import texts from '@/config/texts.json'
import type { PropType } from 'vue'
import ToastHelper from '~/helpers/ToastHelper'
import NumberHelper from '~/helpers/NumberHelper'

const formatMiles = NumberHelper.miles

const cart = useCartStore()
const props = defineProps({
    childClass: String,
    product: {
        type: Object as PropType<IProductCart>,
        required: true
    }
})

const removeFromCart = ((product: IProductCart) => {
    ToastHelper.openToast('product-cart-' + product.id)
    setTimeout(() => {
        cart.removeProducts(product)
    }, 500)
})
</script>

<style lang="scss" scoped>
@import "@/styles/_colors.scss";

.product-cart-card {
    background: $themeBackgroundCards;
    color: $themeColorCards;
}

.cart-item {
    display: flex;
    align-items: center;
}

.cart-item__info {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
}

.cart-item img {
    max-height: 3rem;
}

.cad-item__price {
    display: flex;
    justify-content: space-between;
}
</style>
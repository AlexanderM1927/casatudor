<template>
    <div :class="`product-cart-card card ${childClass}`">
        <div class="card-body cart-item">
            <div class="cart-item__image">
                <img :title="product.name" :src="product.images[0]" alt="{{ product.name }}">
            </div>
            <div class="cart-item__info">
                <h5 class="cad-item__title">{{ product.name }}</h5>
                <p><b>{{ texts.variant_color }}</b>: {{ product.selectedVariants.color }}</p>
                <p><b>{{ texts.variant_size }}</b>: {{ product.selectedVariants.size }}</p>
                <p><b>{{ texts.cart.quantity }}</b>: {{ product.quantity }}</p>
                <div class="d-flex space-between">
                    <p><b>{{ texts.cart.price }}</b>: {{ formatMiles(product.price) }}</p>
                    <p><b>{{ texts.cart.total }}</b>: {{ formatMiles((product.price * product.quantity)) }}</p>
                </div>
            </div>
            <div class="cart-item__delete">
                <a title="Remover del carrito" class="btn btn-danger" @click="removeFromCart(product)">
                    <Icon name="material-symbols:delete" />
                </a>
            </div>
        </div>
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
    border-bottom: 1px solid white;
}

.cart-item__info {
    display: flex;
    flex-direction: column;
    padding: 0.3rem;
    width: 100%;
    font-size: 1rem;
}

.cart-item__info p {
    margin-bottom: 0;
}

.cart-item__image {
    background: transparent;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.cart-item__image img {
    max-height: 3rem;
}

.cart-item__delete {
    display: flex;
    align-items: flex-start;
    flex-direction: row;
}
</style>
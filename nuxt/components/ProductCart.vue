<template>
    <div :class="`flex items-center space-x-4 p-3 bg-white rounded-md`">
        <NuxtImg
            :src="product.images[0]"
            :alt="product.name"
            class="w-16 h-16 object-cover rounded-md"
        />
        <div class="flex-1">
            <h5 class="font-medium card-item__title">{{ product.name }}</h5>
            <p class="text-sm text-gray-500" v-show="product.selectedVariants?.color || product.selectedVariants?.size">
                {{ product.selectedVariants?.color }} / {{ product.selectedVariants?.size }}
            </p>
            <p class="text-sm text-gray-500">Cantidad: {{ product.quantity }}</p>
        </div>
        <div class="text-right">
            <button title="Remover del carrito" class="btn bg-theme-primary" @click="removeFromCart(product)">
                <Icon name="material-symbols:delete" />
            </button>
            <p class="font-semibold text-gray-900">
                ${{ (product.price * product.quantity).toLocaleString() }}
            </p>
        </div>
    </div>
</template>
<script setup lang="ts">
import texts from '@/config/texts.json'
import type { PropType } from 'vue'
import ToastHelper from '~/helpers/ToastHelper'
import type { IProductCart } from '~/types/ProductCart'

const cart = useCartStore()
const props = defineProps({
    product: {
        type: Object as PropType<IProductCart>,
        required: true
    }
})

const removeFromCart = ((product: IProductCart) => {
    ToastHelper.openToast(texts.item_removed, 'success')
    setTimeout(() => {
        cart.removeProducts(product)
    }, 500)
})
</script>

<style lang="scss" scoped>

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
    background: white;
    height: 7rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 10rem;
    
}

.cart-item__image img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.cart-item__delete {
    display: flex;
    align-items: flex-start;
    flex-direction: row;
}

.card-item__total, .card-item__title {
    color: $themeColorText;
}
</style>

<template>
    <div
        v-if="product"
        :class="`product-card ${childClass}`"
        @click="navigateTo('/items/' + getSlugAndId(product.name, product.id))"
    >
        <div class="product-card__image">
            <NuxtImg
                :src="product.images[0]" 
                :alt="product.name"
                :title="product.name"
                :loading="isFirstProduct ? 'eager' : 'lazy'"
                :fetchpriority="isFirstProduct ? 'high' : 'auto'"
                format="webp"
            />
            <div v-if="isOutOfStock" class="product-card__out-of-stock">
                <strong>{{ texts.out_of_stock }}</strong>
            </div>
            <div v-if="product.is_new" class="product-card__new-badge">
                <strong>Nuevo!</strong>
            </div>
            <div class="product-card__image-btn">
                <button 
                    v-if="!isProductOnFavorites" 
                    title="Agregar a favoritos" 
                    class="text-red-700 border border-red-700 hover:bg-red-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-md p-3 text-center inline-flex items-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:focus:ring-red-800 dark:hover:bg-red-50" 
                    @click.stop="addToFavorites(product)"
                >
                    <Icon name="material-symbols:favorite" />
                </button>
                <button 
                    v-else
                    title="Elminar de favoritos" 
                    class="text-gray-700 border border-gray-700 hover:bg-gray-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-md p-3 text-center inline-flex items-center dark:border-gray-500 dark:text-gray-500 dark:hover:text-white dark:focus:ring-gray-800 dark:hover:bg-gray-50" 
                    @click.stop="removeFromFavorites(product)"
                >
                    <Icon name="carbon:favorite-half" />
                </button>
            </div>
        </div>
        <div class="product-card__body">
            <b 
                class="product-card__title" 
                @click="navigateTo('/items/' + getSlugAndId(product.name, product.id))"
            >{{ product.name }}</b>
            <div class="product-card__price">
                <p 
                    v-if="product.price_before_offer"
                    class="product-card__price-offer"
                >
                    ${{ formatMiles(product.price_before_offer) }}
                </p>
                <p>${{ formatMiles(product.price) }}</p>
            </div>
            <div class="product-card__btns">
                <button
                    title="Ver más detalles" 
                    class="add-cart-btn btn btn-primary" 
                    @click="navigateTo('/items/' + getSlugAndId(product.name, product.id))"
                >
                    <Icon name="material-symbols:visibility-outline" />
                </button>
            </div>
        </div>
    </div>
    <Notification v-if="product" type="positive" :toast-id="'product-' + product.id">
        {{ texts.item_added }}
    </Notification>
</template>
<script setup lang="ts">
import texts from '@/config/texts.json'
import type { PropType } from 'vue'
import NumberHelper from '~/helpers/NumberHelper'
import type { IProduct } from '~/types/Product'
import { generateSlug, getSlugAndId } from '~/helpers/SlugHelper'

const favoritesStore = useFavoritesStore()
const favoritesStoreComputed = storeToRefs(favoritesStore)
const favoritesProducts: any = favoritesStoreComputed.getProducts
generateSlug('🌿 Camiseta Básica Valley – Algodón Peruano 100% (200 g)'); // Example usage

const formatMiles = NumberHelper.miles

const props = defineProps({
    childClass: {
        type: String as PropType<String>
    },
    product: {
        required: true,
        type: Object as PropType<IProduct>
    },
    isFirstProduct: {
        type: Boolean,
        default: false
    }
})

const isProductOnFavorites = computed(() => {
    if (favoritesProducts) {
        const isIn = favoritesProducts.value.find((elProd: IProduct) => {
            return elProd.id === props.product.id
        })
        return isIn
    } else {
        return false
    }
})

const isOutOfStock = computed(() => {
    const product = props.product
    
    // Si el producto tiene colores, revisar si todos tienen quantity === 0
    if (product.colors && product.colors.length > 0) {
        const allColorsOutOfStock = product.colors.every(color => color.quantity === 0)
        if (allColorsOutOfStock) return true
    }
    
    // Si el producto tiene tallas, revisar si todos tienen quantity === 0
    if (product.sizes && product.sizes.length > 0) {
        const allSizesOutOfStock = product.sizes.every(size => size.quantity === 0)
        if (allSizesOutOfStock) return true
    }
    
    return false
})

const addToFavorites = ((product: IProduct) => {
    const favoritesLS = localStorage.getItem('favorites')
    const favorites = favoritesLS ? JSON.parse(favoritesLS) : []
    favorites.push(product)
    localStorage.setItem('favorites', JSON.stringify(favorites))
    favoritesStore.addProducts(product)
})

const removeFromFavorites = ((product: IProduct) => {
    const favoritesLS = localStorage.getItem('favorites')
    const favorites = favoritesLS ? JSON.parse(favoritesLS) : []

    const favoritesClean = favorites.filter((el: IProduct) => el.id !== product.id)
    localStorage.setItem('favorites', JSON.stringify(favoritesClean))

    favoritesStore.removeProducts(product)
})

onMounted(() => {
    const favoritesLS = localStorage.getItem('favorites')
    const favorites: [IProduct] = favoritesLS ? JSON.parse(favoritesLS) : []
    favoritesStore.set(favorites)
})
</script>

<style lang="scss" scoped>

.product-card {
    color: $themeColorCards;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
}

.add-cart-btn {
    display: flex;
    align-items: center;
    vertical-align: middle;
    justify-content: space-between;
}

.product-card__image {
    background: $themeBackgroundProductCards;
    height: 15rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center; /* Esto centra verticalmente */
    position: relative;
    padding: 0.5rem;
    border-radius: 0.5rem 0.5rem 0rem 0rem;

}

.product-card__image-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
}

.product-card__image img {
    width: 10rem;
    max-height: 100%;
    align-items: center;
}

.product-card__btns {
    display: flex;
    justify-content: space-between;
}

.product-card__price {
    display: flex;
    justify-content: space-between;
}

.product-card__price-offer {
    color: red;
    text-decoration: line-through;
}

.product-card__title {
    cursor: pointer;
}

.product-card__body {
    background: $themeBackgroundCards;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem;
    border-radius: 0rem 0rem 0.5rem 0.5rem;
}

.product-card__out-of-stock {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 0, 0, 0.9);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    font-size: 1.2rem;
    z-index: 2;
    pointer-events: none;
}

.product-card__new-badge {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    background: #FF8243;
    color: white;
    padding: 0.5rem 0.75rem;
    border-radius: 50%;
    font-size: 0.75rem;
    z-index: 1;
    pointer-events: none;
    width: 3.5rem;
    height: 3.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}
</style>

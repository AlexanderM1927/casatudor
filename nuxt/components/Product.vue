<template>
    <div v-if="product" :class="`product-card card ${childClass}`">
        <NuxtImg
            :src="product.images[0]" 
            :alt="product.name"
            :title="product.name"
            class="card-img-top product-card__img"
            loading="lazy"
            format="webp"
            sizes="sm:100vw md:50vw lg:25vw"
            @click="navigateTo('/items/' + product.id)"
        />
        <div class="card-body">
            <h5 
                class="card-title product-card__title" 
                @click="navigateTo('/items/' + product.id)"
            >{{ product.name }}</h5>
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
                    @click="navigateTo('/items/' + product.id)"
                >
                    <Icon name="material-symbols:visibility-outline" />
                </button>
                <button 
                    v-if="!isProductOnFavorites" 
                    title="Agregar a favoritos" 
                    class="add-cart-btn btn btn-danger" 
                    @click="addToFavorites(product)"
                >
                    <Icon name="material-symbols:favorite" />
                </button>
                <button 
                    v-else
                    title="Elminar de favoritos" 
                    class="add-cart-btn btn btn-danger" 
                    @click="removeFromFavorites(product)"
                >
                    <Icon name="carbon:favorite-half" />
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
import ToastHelper from '~/helpers/ToastHelper'

const cart = useCartStore()
const favoritesStore = useFavoritesStore()
const favoritesStoreComputed = storeToRefs(favoritesStore)
const favoritesProducts: any = favoritesStoreComputed.getProducts

const formatMiles = NumberHelper.miles

const props = defineProps({
    childClass: {
        type: String as PropType<String>
    },
    product: {
        required: true,
        type: Object as PropType<IProduct>
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
@import "@/styles/_colors.scss";

.product-card {
    background: $themeBackgroundCards;
    color: $themeColorCards;
}

.add-cart-btn {
    display: flex;
    align-items: center;
    vertical-align: middle;
    justify-content: space-between;
}

.product-card__img {
    cursor: pointer;
    width: 100%;
    height: 10rem;
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
</style>
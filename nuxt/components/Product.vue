<template>
    <div v-if="product" :class="`card ${childClass}`">
        <img :title="product.name" :src="product.image" class="card-img-top product__img" alt="...">
        <div class="card-body">
            <h5 class="card-title">{{ product.name }}</h5>
            <p>${{ formatMiles(product.price) }}</p>
            <div class="product__btns">
                <a 
                    title="Agregar al carrito" 
                    class="add-cart-btn btn btn-outline-primary" 
                    @click="addToCart(product)"
                >
                    <Icon name="material-symbols:add-shopping-cart" />
                </a>
                <a 
                    v-if="!isProductOnFavorites" 
                    title="Agregar a favoritos" 
                    class="add-cart-btn btn btn-outline-danger" 
                    @click="addToFavorites(product)"
                >
                    <Icon name="material-symbols:favorite" />
                </a>
                <a 
                    v-else
                    title="Elminar de favoritos" 
                    class="add-cart-btn btn btn-outline-danger" 
                    @click="removeFromFavorites(product)"
                >
                    <Icon name="carbon:favorite-half" />
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
import ToastHelper from '~/helpers/ToastHelper';

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

const addToCart = ((product: IProduct) => {
    ToastHelper.openToast('product-' + product.id)
    const productCart: IProductCart = {
        ...product,
        quantity: 1
    }
    cart.addProducts(productCart)
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
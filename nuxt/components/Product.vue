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
import { useLocalbase } from '~/composables/useLocalbase'
const nuxtApp = useNuxtApp()
const { db, deleteDataCollection }: any = useLocalbase(nuxtApp)

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

const isProductOnFavorites = computed(() => {
    if (favoritesProducts) {
        const isIn = favoritesProducts.value.find((elProd: Product) => {
            return elProd.id === props.product.id
        })
        return isIn
    } else {
        return false
    }
})

const addToFavorites = ((product: Product) => {
    db.collection('favorites').add(JSON.parse(JSON.stringify(product)))
    favoritesStore.addProducts(product)
})

const removeFromFavorites = ((product: Product) => {
    deleteDataCollection('favorites', product.id)
    favoritesStore.removeProducts(product)
})

onMounted(() => {
    db.collection('favorites').get().then((products: [Product]) => {
        favoritesStore.set(products)
    })
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
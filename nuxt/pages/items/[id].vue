<template>
    <div class="container custom-container product-page">
        <div class="product-container">
            <div class="product-container__image">
                <img :title="product.name" :src="product.image" alt="{{ product.name }}">
            </div>
            <div class="product-container__content">
                <h2 class="title">{{ product.name }}</h2>
                <b>{{ texts.description }}:</b>
                <p>
                    {{ product.description }}
                </p>
                <div class="product-container__price">
                    <p 
                        v-if="product.price_before_offer"
                        class="product-container__price-offer"
                    >
                        ${{ formatMiles(product.price_before_offer) }}
                    </p>
                    <p>${{ formatMiles(product.price) }}</p>
                </div>
                <div class="product-container__btns">
                <a 
                    title="Agregar al carrito" 
                    class="add-cart-btn btn btn-primary" 
                    @click="addToCart(product)"
                >
                    <Icon name="material-symbols:add-shopping-cart" />
                    {{ texts.add_to_cart }}
                </a>
                <a 
                    v-if="!isProductOnFavorites" 
                    title="Agregar a favoritos" 
                    class="add-cart-btn btn btn-danger" 
                    @click="addToFavorites(product)"
                >
                    <Icon name="material-symbols:favorite" />
                    {{ texts.add_to_favorites }}
                </a>
                <a 
                    v-else
                    title="Elminar de favoritos" 
                    class="add-cart-btn btn btn-danger" 
                    @click="removeFromFavorites(product)"
                >
                    <Icon name="carbon:favorite-half" />
                    {{ texts.remove_from_favorites }}
                </a>
            </div>
            </div>
        </div>
    </div>
    <Notification v-if="product" type="positive" :toast-id="'product-' + product.id">
        {{ texts.item_added }}
    </Notification>
</template>
<script setup lang="ts">
import texts from '@/config/texts.json'
import ProductService from '@/services/ProductService'
import NumberHelper from '~/helpers/NumberHelper'
import { useImageFromStrapi } from '@/composables/useImageFromStrapi'
import ToastHelper from '~/helpers/ToastHelper'

const cart = useCartStore()
const favoritesStore = useFavoritesStore()
const favoritesStoreComputed = storeToRefs(favoritesStore)
const favoritesProducts: any = favoritesStoreComputed.getProducts

const formatMiles = NumberHelper.miles

const route = useRoute()

const isLoading: Ref<Boolean> = ref(true);

const product: Ref<IProduct> = ref({
    id: 1,
    name: '',
    image: '',
    price: 0
})

const productService = new ProductService(useRuntimeConfig())


const getProduct = async (newPage: number = 1) => {
    isLoading.value = true
    const { data }: any = await productService.getSingleProduct(route.params.id)
    product.value = data.map(({ id, attributes }: { id: number, attributes: any }) => {
        const product: IProduct = {
            ...attributes,
            image: useImageFromStrapi(attributes.image.data.attributes.url),
            id: id
        }
        return product
    })[0]

    isLoading.value = false
}

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
            return elProd.id === product.value.id
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

onMounted(() => {
    getProduct()
})
</script>
<style lang="scss">
.product-page {
    width: 100%;
}
.product-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
}

.product-container__image {
    display: flex;
    width: 100%;
    justify-content: center;
}

.product-container__image img {
    max-width: 100%;
}

.product-container__content {
    padding: 1rem;
}

.product-container__btns {
    display: flex;
    justify-content: space-between;
}

.product-container__price {
    display: flex;
    justify-content: space-between;
}

.product-container__price-offer {
    color: red;
    text-decoration: line-through;
}
</style>

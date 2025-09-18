<template>
    <div class="first-container product-page">
        <div class="product-container">
            <div class="product-container__image">
                <img
                    :title="product.name"
                    :src="product.images[0]"
                    :alt="product.name"
                    id="main-image"
                />
                <div class="slider-product" v-show="product.images.length > 1">
                    <div
                        v-for="image in product.images"
                        class="slider-product__item"
                        @click="changeMainImage(image)"
                    >
                        <img :src="image" :alt="image">
                    </div>
                </div>
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
                <div class="product-container__variants">
                    <div v-show="product.colors && product.colors.length > 0">
                        <b>{{ texts.variant_color }}:</b>
                        <div class="variants__colors">
                            <input
                                v-for="(color, index) in product.colors" 
                                :key="color.id"
                                :checked="index === 0"
                                class="variants__colors-input"
                                :style="`background: ${color.hexadecimal};`"
                                type="radio"
                                :id='color.id'
                                name="colors"
                                :value="color.name"
                            >
                        </div>
                    </div>
                    <div v-show="product.sizes && product.sizes.length > 0">
                        <b>{{ texts.variant_size }}:</b>
                        <div class="variants__size">
                            <select
                                id="variant-size"
                                name="variant-size"
                                class="form-select"
                            >
                                <option 
                                    v-for="size in product.sizes" 
                                    :key="size.id"
                                    :value="size.name"
                                >
                                    {{ size.name }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="product-container__btns">
                <button 
                    v-if="!isProductOnFavorites" 
                    title="Agregar a favoritos" 
                    class="add-cart-btn btn btn-danger" 
                    @click="addToFavorites(product)"
                >
                    <Icon name="material-symbols:favorite" />
                    {{ texts.add_to_favorites }}
                </button>
                <button 
                    v-else
                    title="Elminar de favoritos" 
                    class="add-cart-btn btn btn-danger" 
                    @click="removeFromFavorites(product)"
                >
                    <Icon name="carbon:favorite-half" />
                    {{ texts.remove_from_favorites }}
                </button>
                <button 
                    title="Agregar al carrito" 
                    class="add-cart-btn btn btn-primary" 
                    @click="addToCart(product)"
                >
                    <Icon name="material-symbols:add-shopping-cart" />
                    {{ texts.add_to_cart }}
                </button>
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

const isLoading: Ref<Boolean> = ref(true)

const product: Ref<IProduct> = ref({
    id: 1,
    name: '',
    images: [''],
    price: 0
})

const productService = new ProductService(useRuntimeConfig())


const getProduct = async (newPage: number = 1) => {
    isLoading.value = true
    const { data }: any = await productService.getSingleProduct(route.params.id)
    product.value = data.map(({ id, attributes }: { id: number, attributes: any }) => {
        const product: IProduct = {
            ...attributes,
            images: attributes.image.data.map((el: IImageStrapi) => {
                return useImageFromStrapi(el.attributes?.url)
            }),
            id: id
        }
        return product
    })[0]

    isLoading.value = false
}

const addToCart = ((product: IProduct) => {
    ToastHelper.openToast('product-' + product.id)
    const colorSelected = (document.querySelector('input[name="colors"]:checked') as HTMLInputElement)?.value
    const sizeSelected = (document.getElementById('variant-size') as HTMLInputElement)?.value

    const productCart: IProductCart = {
        ...product,
        quantity: 1,
        selectedVariants: {
            color: colorSelected ?? '',
            size: sizeSelected ?? '',
        }
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

const changeMainImage = (image: string) => {
    (document.getElementById('main-image') as HTMLImageElement).src = image
}

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
    flex-direction: column;
    width: 100%;
    align-items: center;
    justify-content: center;
}

.product-container__image img {
    max-width: 100%;
    height: 20rem;
}

.product-container__content {
    padding: 1rem;
}

.product-container__btns {
    display: flex;
    justify-content: space-between;
}

.product-container__btns > a {
    width: 50%;
}

.product-container__price {
    display: flex;
    justify-content: space-between;
}

.product-container__price-offer {
    color: red;
    text-decoration: line-through;
}

.variants__colors {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.variants__colors-input {
    appearance: none;
    -webkit-appearance: none;
    border-radius: 50%;
    width: 1.5rem;
    height: 1.5rem;
    padding: 1rem;
}

.variants__colors-input:checked {
    border: 0.2rem solid #FFF;
}

.variants__size {
    margin-bottom: 0.5rem;
}

.slider-product {
    margin-top: 1.5rem;
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

.slider-product__item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 5rem;
    height: 5rem;
    background: white;
    padding: 0.5rem;
    cursor: pointer;
    box-shadow: 0 0px 0px 0 rgba(0, 0, 0, 0.14), 0 0px 1rem 0 rgba(0, 0, 0, 0.12), 0 0.1rem 0.2rem -0.1rem rgba(0, 0, 0, 0.3);
}

.slider-product__item img {
    width: 5rem;
    height: 5rem;
}
</style>

<template>
    <div class="first-container product-page bg-white">
        <div class="product-container">
            <div class="product-container__image">
                <NuxtImg
                    :title="product.name"
                    :src="currentMainImage || product.images[0]"
                    :alt="product.name"
                    id="main-image"
                    @mouseenter="stopImageRotation"
                    @mouseleave="startImageRotation"
                />
                <div class="slider-product" v-show="product.images.length > 1">
                    <div
                        v-for="image in product.images"
                        class="slider-product__item"
                        @click="changeMainImage(image)"
                    >
                        <NuxtImg :src="image" :alt="image" />
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
                                @change="onColorVariantChange(color)"
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
                <div class="product-container__quantity">
                    <label for="quantity"><b>{{ texts.quantity || 'Cantidad' }}:</b></label>
                    <div class="quantity-input">
                        <button 
                            type="button" 
                            class="quantity-btn" 
                            @click="decreaseQuantity"
                            :disabled="selectedQuantity <= 1"
                        >
                            -
                        </button>
                        <input 
                            id="quantity"
                            v-model.number="selectedQuantity" 
                            type="number" 
                            min="1" 
                            max="99"
                            class="quantity-field"
                        />
                        <button 
                            type="button" 
                            class="quantity-btn" 
                            @click="increaseQuantity"
                        >
                            +
                        </button>
                    </div>
                </div>
                <div class="product-container__btns">
                <div>
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
                        class="add-cart-btn btn text-gray-700 border border-gray-700 hover:bg-gray-700" 
                        @click="removeFromFavorites(product)"
                    >
                        <Icon name="carbon:favorite-half" />
                    </button>
                </div>
                <div>
                    <button 
                        title="Agregar al carrito" 
                        class="add-cart-btn btn btn-success" 
                        @click="purchaseByWhatsapp(product)"
                    >
                        <Icon name="mdi:whatsapp" />
                        {{ texts.buy_on_whatsapp }}
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
    </div>
    
    <!-- Productos relacionados -->
    <section v-if="relatedProducts.length > 0" class="second-container">
        <h3 class="related-title">{{ texts.related_products || 'Productos relacionados' }}</h3>
        <div class="row">
            <Product
                v-for="(relatedProduct, index) in relatedProducts"
                :key="relatedProduct.id"
                :product="relatedProduct"
                :childClass="`col-lg-3 col-md-6 col-sm-12`"
                :isFirstProduct="index === 0"
            />
        </div>
    </section>
</template>
<script setup lang="ts">
import texts from '@/config/texts.json'
import ProductService from '@/services/ProductService'
import NumberHelper from '~/helpers/NumberHelper'
import { useImageFromStrapi } from '@/composables/useImageFromStrapi'
import ToastHelper from '~/helpers/ToastHelper'
import type { IProduct, IColor } from '~/types/Product'
import type { IProductCart } from '~/types/ProductCart'
import type { IImageStrapi } from '~/types/ImageStrapi'

const cart = useCartStore()
const favoritesStore = useFavoritesStore()
const favoritesStoreComputed = storeToRefs(favoritesStore)
const favoritesProducts: any = favoritesStoreComputed.getProducts
const { footerData, fetchFooter } = useFooter()

const formatMiles = NumberHelper.miles

const route = useRoute()

const isLoading: Ref<Boolean> = ref(true)
const currentMainImage: Ref<string> = ref('')
const selectedQuantity: Ref<number> = ref(1)
const dataFooter: any = footerData
const currentImageIndex: Ref<number> = ref(0)
const imageInterval: Ref<NodeJS.Timeout | null> = ref(null)

const product: Ref<IProduct> = ref({
    id: 1,
    name: '',
    images: [''],
    price: 0
})

const relatedProducts: Ref<IProduct[]> = ref([])
const productService = new ProductService(useRuntimeConfig())


const getProduct = async (newPage: number = 1) => {
    isLoading.value = true
    const { data }: any = await productService.getSingleProduct(route.params.id)
    product.value = data.map(({ id, attributes }: { id: number, attributes: any }) => {
        const product: IProduct = {
            ...attributes,
            images: attributes.image.data.map((el: IImageStrapi) => {
                return useImageFromStrapi(el?.attributes?.url)
            }),
            colors: attributes.colors?.map((color: any) => ({
                id: color.id,
                name: color.name,
                hexadecimal: color.hexadecimal,
                image: color.image?.data ? useImageFromStrapi(color.image.data.attributes.url) : null
            })) || [],
            sizes: attributes.sizes?.map((size: any) => ({
                id: size.id,
                name: size.name
            })) || [],
            category: attributes.category?.data ? {
                id: attributes.category.data.id,
                ...attributes.category.data.attributes
            } : null,
            id: id
        }
        return product
    })[0]

    // Establecer la primera imagen como imagen principal cuando se carga el producto
    if (product.value.images && product.value.images.length > 0) {
        currentMainImage.value = product.value.images[0]
        currentImageIndex.value = 0
        // Iniciar rotación automática si hay más de una imagen
        startImageRotation()
    }

    // Obtener productos relacionados si el producto tiene categoría
    if (product.value.category) {
        await getRelatedProducts(product.value.category.id, product.value.id)
    }

    isLoading.value = false
}

const getRelatedProducts = async (categoryId: number, excludeProductId: number) => {
    try {
        const { data }: any = await productService.getRelatedProducts(categoryId, excludeProductId, 4)
        
        // Mapear los productos relacionados
        let mappedProducts = data.map(({ id, attributes }: { id: number, attributes: any }) => {
            const product: IProduct = {
                ...attributes,
                images: attributes.image.data.map((el: IImageStrapi) => {
                    return useImageFromStrapi(el?.attributes?.url)
                }),
                colors: attributes.colors?.map((color: any) => ({
                    id: color.id,
                    name: color.name,
                    hexadecimal: color.hexadecimal,
                    image: color.image?.data ? useImageFromStrapi(color.image.data.attributes.url) : null
                })) || [],
                sizes: attributes.sizes?.map((size: any) => ({
                    id: size.id,
                    name: size.name
                })) || [],
                id: id
            }
            return product
        })

        // Seleccionar 4 productos aleatorios
        const shuffled = mappedProducts.sort(() => 0.5 - Math.random())
        relatedProducts.value = shuffled.slice(0, 4)
        
    } catch (error) {
        console.error('Error fetching related products:', error)
        relatedProducts.value = []
    }
}

const addToCart = ((product: IProduct) => {
    ToastHelper.openToast(texts.item_added, 'success')
    const colorSelected = (document.querySelector('input[name="colors"]:checked') as HTMLInputElement)?.value
    const sizeSelected = (document.getElementById('variant-size') as HTMLInputElement)?.value

    const productCart: IProductCart = {
        ...product,
        quantity: selectedQuantity.value,
        selectedVariants: {
            color: colorSelected ?? '',
            size: sizeSelected ?? '',
        }
    }
    cart.addProducts(productCart)
})

const purchaseByWhatsapp = ((product: IProduct) => {
    let listOfProducts = '¡Hola!,%20estoy%20interesado%20en%20comprar%20estos%20productos:%0A'
    const colorSelected = (document.querySelector('input[name="colors"]:checked') as HTMLInputElement)?.value
    const sizeSelected = (document.getElementById('variant-size') as HTMLInputElement)?.value

    const productCart: IProductCart = {
        ...product,
        quantity: selectedQuantity.value,
        selectedVariants: {
            color: colorSelected ?? '',
            size: sizeSelected ?? '',
        }
    }
    const productName = productCart.name
    const quantity = productCart.quantity
    const color = productCart?.selectedVariants?.color
    const size = productCart?.selectedVariants?.size
    listOfProducts += `${productName} ${color ? '- Color: ' + color : ''} ${size ? '- Talla: ' + size : ''} - Cantidad: ${quantity}`
    listOfProducts += `,%20 %0A`
    window.open(`https://wa.me/${dataFooter?.value?.whatsappPhone}?text=${listOfProducts}`)
})

const increaseQuantity = () => {
    if (selectedQuantity.value < 99) {
        selectedQuantity.value++
    }
}

const decreaseQuantity = () => {
    if (selectedQuantity.value > 1) {
        selectedQuantity.value--
    }
}

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
    currentMainImage.value = image
    // Actualizar el índice cuando se cambia manualmente
    const index = product.value.images.findIndex(img => img === image)
    if (index !== -1) {
        currentImageIndex.value = index
    }
}

const startImageRotation = () => {
    if (product.value.images && product.value.images.length > 1) {
        imageInterval.value = setInterval(() => {
            currentImageIndex.value = (currentImageIndex.value + 1) % product.value.images.length
            currentMainImage.value = product.value.images[currentImageIndex.value]
        }, 5000) // Cambiar cada 5 segundos
    }
}

const stopImageRotation = () => {
    if (imageInterval.value) {
        clearInterval(imageInterval.value)
        imageInterval.value = null
    }
}

const onColorVariantChange = (color: IColor) => {
    // Detener la rotación automática cuando se selecciona un color
    stopImageRotation()
    
    // Si la variante de color tiene una imagen, cambiar a esa imagen
    if (color.image) {
        currentMainImage.value = color.image
        // Buscar el índice de esta imagen en el array de imágenes
        const index = product.value.images.findIndex(img => img === color.image)
        if (index !== -1) {
            currentImageIndex.value = index
        }
    } else {
        // Si no tiene imagen, volver a la primera imagen del producto
        currentMainImage.value = product.value.images[0]
        currentImageIndex.value = 0
    }
    
    // Reiniciar la rotación automática después de 3 segundos
    setTimeout(() => {
        startImageRotation()
    }, 3000)
}

onMounted(() => {
    getProduct()
    const favoritesLS = localStorage.getItem('favorites')
    const favorites: [IProduct] = favoritesLS ? JSON.parse(favoritesLS) : []
    favoritesStore.set(favorites)
    fetchFooter()
})

onUnmounted(() => {
    // Limpiar el intervalo al desmontar el componente
    stopImageRotation()
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
    width: auto;
    height: 30rem;
}

.product-container__content {
    padding: 1rem;
}

.product-container__btns {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
}

.product-container__btns div:last-child {
    display: flex;
    gap: 0.5rem;
}

@media only screen and (max-width: $grid-breakpoints-sm) {
    .product-container__btns {
        flex-direction: column;
    }
    .product-container__btns div:last-child {
        flex-direction: column;
        button {
            width: 100%;
        }
    }
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
    border: 0.2rem solid $secondary;
}

.variants__size {
    margin-bottom: 0.5rem;
}

.product-container__quantity {
    margin-bottom: 1rem;
}

.quantity-input {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
}

.quantity-btn {
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.2rem;
    transition: background-color 0.2s;
}

.quantity-btn:hover:not(:disabled) {
    background: #0056b3;
}

.quantity-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
}

.quantity-field {
    width: 4rem;
    height: 2rem;
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
}

.quantity-field:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
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

.related-products-section {
    margin-top: 3rem;
    border-top: 1px solid #e9ecef;
}

.related-title {
    color: $primary;
    font-size: 1.8rem;
    font-weight: 600;
    text-align: center;
    margin-bottom: 2rem;
}

.related-products-section .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

@media only screen and (max-width: $grid-breakpoints-md) {
    .related-products-section {
        margin-top: 2rem;
        padding: 1.5rem 0;
    }
    
    .related-title {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
    }
}
</style>

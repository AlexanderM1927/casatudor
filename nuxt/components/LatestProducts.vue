<template>
    <section v-if="!isLoading" class="second-container">
        <h2 class="title">{{ texts.last_products }}</h2>
        <br>
        <div class="row">
            <Product 
                v-for="(product, index) in products"
                :key="index"
                :product="product"
                :childClass="`col-md-3 col-xs-12`"
                :isFirstProduct="index < 2"
            ></Product>
        </div>
    </section>
</template>
<script setup lang="ts">
import texts from '@/config/texts.json'
import ProductService from '@/services/ProductService'
import type { IImageStrapi } from '~/types/ImageStrapi'
import type { IProduct } from '~/types/Product'

const appConfig = useRuntimeConfig()
const productService = new ProductService(appConfig)
const isLoading: Ref<Boolean> = ref(true)
const products: Ref<IProduct[]|[]> = ref([])

const getProducts = async () => {
    isLoading.value = true
    try {
        const { data }: any = await productService.getHomeProducts()
        products.value = data.map(({ id, attributes }: { id: number, attributes: any }) => {
            const product: IProduct = {
                ...attributes,
                images: attributes.image.data.map((el: IImageStrapi) => {
                    return useImageFromStrapi(el?.attributes?.url)
                }),
                id: id
            }
            return product
        })
    } catch (e) {
        console.log(e)
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    getProducts()
})

</script>

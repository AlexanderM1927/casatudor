<template>
    <section v-if="!isLoading" class="second-container latest-products">
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
import type { IProduct } from '~/types/Product'

const appConfig = useRuntimeConfig()
const productService = new ProductService(appConfig)
const isLoading: Ref<Boolean> = ref(true)
const products: Ref<IProduct[]|[]> = ref([])

const getProducts = async () => {
    isLoading.value = true
    try {
        const { data }: any = await productService.getHomeProducts()
        const mappedProducts = data.map((item: any) => {
            const product: IProduct = {
                ...item,
                images: (item.image || []).map((el: any) => {
                    return useImageFromStrapi(el?.url)
                }),
            }
            return product
        })
        products.value = mappedProducts
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
<style lang="scss">
</style>
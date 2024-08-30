<template>
    <div class="container custom-container">
        <h2 class="title">{{ promotion.text }}</h2>
        <div class="row">
            <Product 
                v-for="(product, index) in products"
                :product="product"
                :childClass="`col-md-3 col-xs-12`"
                :key="index"
            ></Product>
        </div>
    </div>
</template>
<script setup lang="ts">
import PromotionService from '@/services/PromotionService'
import { useImageFromStrapi } from '@/composables/useImageFromStrapi'

const route = useRoute()

const isLoading: Ref<Boolean> = ref(true)
const products: Ref<IProduct[]> = ref([])

const promotion: Ref<IPromotion> = ref({
    id: 1,
    text: '',
    products: [],
    isEnabled: false
})

const promotionService = new PromotionService(useRuntimeConfig())


const getPromotions = async (newPage: number = 1) => {
    isLoading.value = true
    const { data }: any = await promotionService.getSinglePromotion(route.params.id)
    promotion.value = data.map(({ id, attributes }: { id: number, attributes: any }) => {
        const promotion: IPromotion = {
            ...attributes,
            id
        }
        return promotion
    })[0]
    const promotionsData = promotion.value
    const { data: dataProducts } = promotionsData.products
    console.log('dataProducts', dataProducts)
    products.value = dataProducts.map(({ id, attributes }: { id: number, attributes: any }) => {
        const product: IProduct = {
            ...attributes,
            image: useImageFromStrapi(attributes.image.data.attributes.url),
            id
        }
        return product
    })

    isLoading.value = false
}

onMounted(() => {
    getPromotions()
})
</script>

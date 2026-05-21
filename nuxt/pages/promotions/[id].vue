<template>
    <div class="first-container">
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
import { sortByField } from '~/helpers/SortHelper'

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
    promotion.value = data.map((item: any) => {
        const promotion: IPromotion = {
            ...item,
        }
        return promotion
    })[0]
    const promotionsData = promotion.value
    // Strapi v5: products is a flat array, no .data wrapper
    const dataProducts = Array.isArray(promotionsData.products) ? promotionsData.products : (promotionsData.products?.data || [])
    const mappedProducts = dataProducts.map((item: any) => {
        const product: IProduct = {
            ...item,
            images: (item.image || []).map((el: any) => {
                return useImageFromStrapi(el?.url)
            }),
        }
        return product
    })
    products.value = sortByField(mappedProducts)

    isLoading.value = false
}

onMounted(() => {
    getPromotions()
})
</script>
